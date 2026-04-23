import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BlockPublicAccess, Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import {
  Distribution,
  PriceClass,
  ViewerProtocolPolicy,
  AllowedMethods,
  CachePolicy,
  OriginRequestPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

interface WebStackProps extends StackProps {
  stageName: string;
  apiDomain: string;
}

/**
 * Static site distribution. Assumes `pnpm --filter @piramid/web build` was run
 * with `next export` (or equivalent adapter) and the result synced to
 * `siteBucket` — CI handles the sync step after the stack exists.
 *
 * `/api/*` gets reverse-proxied to the ALB so both live under one origin from
 * the browser's perspective and we don't need to wrestle with CORS in prod.
 */
export class WebStack extends Stack {
  readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    const siteBucket = new Bucket(this, "SiteBucket", {
      bucketName: `piramid-${props.stageName}-web`,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: props.stageName === "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: props.stageName !== "prod",
    });

    this.distribution = new Distribution(this, "WebDistribution", {
      priceClass: PriceClass.PRICE_CLASS_100,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      additionalBehaviors: {
        "/api/*": {
          origin: new HttpOrigin(props.apiDomain, {
            protocolPolicy:
              props.stageName === "prod" ? /* prod ALB will have ACM cert */ undefined : undefined,
          }),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: AllowedMethods.ALLOW_ALL,
          cachePolicy: CachePolicy.CACHING_DISABLED,
          originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.seconds(0),
        },
      ],
    });
  }
}
