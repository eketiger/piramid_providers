import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IVpc, Port } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage, LogDriver, Secret as EcsSecret } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

interface ApiStackProps extends StackProps {
  stageName: string;
  vpc: IVpc;
  uploadsBucket: Bucket;
  dbSecret: Secret;
}

/**
 * API runs on Fargate behind an ALB.
 *
 * Image is pulled from an ECR repo created in this stack — CI pushes
 * @piramid/api images tagged `:stage-<sha>` and bumps the service task
 * definition in a separate deploy step.
 *
 * Observability:
 *   - CloudWatch log group with 30d retention (stage) / 180d (prod).
 *   - Env vars: SENTRY_DSN (pulled from Secrets Manager if set), LOG_LEVEL.
 *   - Later: x-ray instrumentation via the OTel sidecar + ADOT collector.
 */
export class ApiStack extends Stack {
  readonly albDnsName: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const repo = new Repository(this, "ApiRepo", {
      repositoryName: `piramid-${props.stageName}/api`,
      imageScanOnPush: true,
    });

    const cluster = new Cluster(this, "Cluster", {
      vpc: props.vpc,
      containerInsights: true,
    });

    const logGroup = new LogGroup(this, "ApiLogs", {
      logGroupName: `/piramid/${props.stageName}/api`,
      retention: props.stageName === "prod" ? RetentionDays.SIX_MONTHS : RetentionDays.ONE_MONTH,
    });

    const sentryDsnSecret = Secret.fromSecretNameV2(
      this,
      "SentryDsn",
      `piramid-${props.stageName}/sentry/dsn`,
    );

    const service = new ApplicationLoadBalancedFargateService(this, "ApiService", {
      cluster,
      cpu: props.stageName === "prod" ? 1024 : 512,
      memoryLimitMiB: props.stageName === "prod" ? 2048 : 1024,
      desiredCount: props.stageName === "prod" ? 2 : 1,
      publicLoadBalancer: true,
      assignPublicIp: false,
      taskImageOptions: {
        image: ContainerImage.fromEcrRepository(repo, "latest"),
        containerPort: 4000,
        logDriver: LogDriver.awsLogs({ logGroup, streamPrefix: "api" }),
        environment: {
          NODE_ENV: props.stageName === "prod" ? "production" : props.stageName,
          LOG_LEVEL: props.stageName === "prod" ? "info" : "debug",
          CORS_ORIGIN: `https://web-${props.stageName}.piramid.com.ar`,
        },
        secrets: {
          DATABASE_URL: EcsSecret.fromSecretsManager(props.dbSecret, "url"),
          SENTRY_DSN: EcsSecret.fromSecretsManager(sentryDsnSecret),
        },
      },
      healthCheckGracePeriod: Duration.seconds(60),
    });

    // Expose the container port to the ALB SG and allow S3 puts via IAM.
    service.targetGroup.configureHealthCheck({
      path: "/api/v1/healthz",
      healthyHttpCodes: "200-299",
    });
    service.service.connections.allowFromAnyIpv4(Port.tcp(4000));
    props.uploadsBucket.grantReadWrite(service.taskDefinition.taskRole);

    this.albDnsName = service.loadBalancer.loadBalancerDnsName;
  }
}
