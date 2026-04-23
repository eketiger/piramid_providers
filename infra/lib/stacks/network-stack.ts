import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IVpc, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

/**
 * Thin VPC with 2 AZs, one NAT (enough for dev/stage).
 * Prod would bump AZs to 3 and natGateways to 2 for HA.
 *
 * We pass `availabilityZones` explicitly instead of `maxAzs` so `cdk synth`
 * works in CI without real AWS credentials (maxAzs forces an AZ lookup via
 * the CDK context provider, which calls AWS and fails on a dummy account).
 */
export class NetworkStack extends Stack {
  readonly vpc: IVpc;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const region = this.region;
    const azs = [`${region}a`, `${region}b`];

    this.vpc = new Vpc(this, "Vpc", {
      availabilityZones: azs,
      natGateways: 1,
      subnetConfiguration: [
        { name: "public", subnetType: SubnetType.PUBLIC, cidrMask: 24 },
        { name: "private", subnetType: SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24 },
      ],
    });
  }
}
