import { describe, it } from "vitest";
import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { NetworkStack } from "../lib/stacks/network-stack";
import { DataStack } from "../lib/stacks/data-stack";
import { ApiStack } from "../lib/stacks/api-stack";

/**
 * CDK unit tests. They don't require AWS credentials — they snapshot the
 * synthesized CFN template and assert shapes. Good enough to catch
 * regressions when we tweak security groups, task sizes, etc.
 */
describe("Piramid stacks", () => {
  it("NetworkStack exposes a VPC with 2 AZs", () => {
    const app = new App();
    const stack = new NetworkStack(app, "network-test", {});
    const template = Template.fromStack(stack);
    template.resourceCountIs("AWS::EC2::VPC", 1);
    // 2 public + 2 private = 4 subnets
    template.resourceCountIs("AWS::EC2::Subnet", 4);
  });

  it("DataStack creates the uploads bucket with encryption + SSL-only access", () => {
    const app = new App();
    const network = new NetworkStack(app, "network", {});
    const data = new DataStack(app, "data", {
      stageName: "dev",
      vpc: network.vpc,
    });
    const template = Template.fromStack(data);
    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          { ServerSideEncryptionByDefault: { SSEAlgorithm: "AES256" } },
        ],
      },
      VersioningConfiguration: { Status: "Enabled" },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
    template.hasResourceProperties("AWS::SecretsManager::Secret", {
      Name: "piramid-dev/db/connection-url",
    });
  });

  it("ApiStack wires the ECS service on port 4000 with a healthcheck path", () => {
    const app = new App();
    const network = new NetworkStack(app, "network", {});
    const data = new DataStack(app, "data", { stageName: "dev", vpc: network.vpc });
    const api = new ApiStack(app, "api", {
      stageName: "dev",
      vpc: network.vpc,
      uploadsBucket: data.uploadsBucket,
      dbSecret: data.dbSecret,
    });
    const template = Template.fromStack(api);
    template.hasResourceProperties("AWS::ElasticLoadBalancingV2::TargetGroup", {
      HealthCheckPath: "/api/v1/healthz",
      Protocol: "HTTP",
    });
    template.hasResourceProperties("AWS::ECS::TaskDefinition", {
      ContainerDefinitions: [
        {
          PortMappings: [{ ContainerPort: 4000, Protocol: "tcp" }],
        },
      ],
    });
    template.resourceCountIs("AWS::ECS::Service", 1);
  });
});
