import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  HttpMethods,
  LifecycleRule,
  StorageClass,
} from "aws-cdk-lib/aws-s3";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

interface DataStackProps extends StackProps {
  stageName: string;
  vpc: IVpc;
}

/**
 * Stateful resources (S3 + DB credentials).
 * Separate stack so accidental `cdk destroy` of the API stack can't nuke data.
 */
export class DataStack extends Stack {
  readonly uploadsBucket: Bucket;
  readonly dbSecret: Secret;

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);

    const lifecycleRules: LifecycleRule[] = [
      {
        id: "evidence-to-glacier-after-1y",
        transitions: [{ storageClass: StorageClass.GLACIER, transitionAfter: Duration.days(365) }],
      },
    ];

    this.uploadsBucket = new Bucket(this, "UploadsBucket", {
      bucketName: `piramid-${props.stageName}-uploads`,
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      lifecycleRules,
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST],
          allowedOrigins: ["*"], // tighten per-stage once the web domain is known
          allowedHeaders: ["*"],
          exposedHeaders: ["ETag"],
          maxAge: 3000,
        },
      ],
      removalPolicy: props.stageName === "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: props.stageName !== "prod",
    });

    /**
     * DB credentials. Populated out-of-band:
     *   - dev/stage: Planetscale branch (create a service token, paste its
     *     connection URL with the user/password embedded into the "url" key
     *     of this secret).
     *   - prod: Planetscale production branch, same shape.
     *
     * We create the secret with a deterministic name and a seed value so
     * ApiStack can always reference it. The real URL is rotated via the
     * AWS console or a secret-rotation Lambda; never commit a Planetscale
     * token to this repo.
     */
    this.dbSecret = new Secret(this, "DbConnectionSecret", {
      secretName: `piramid-${props.stageName}/db/connection-url`,
      description:
        "MySQL connection URL for Prisma's DATABASE_URL. Populate with the Planetscale branch URL.",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          url: "mysql://piramid:REPLACE_ME@aws.connect.psdb.cloud/piramid?sslaccept=strict",
        }),
        generateStringKey: "rotatingPart",
        excludePunctuation: true,
      },
    });
  }
}
