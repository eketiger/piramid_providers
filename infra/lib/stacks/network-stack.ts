import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IVpc, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

/**
 * Thin VPC with 2 AZs, one NAT (enough for dev/stage).
 * Prod would bump maxAzs to 3 and natGateways to 2 for HA.
 */
export class NetworkStack extends Stack {
  readonly vpc: IVpc;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        { name: "public", subnetType: SubnetType.PUBLIC, cidrMask: 24 },
        { name: "private", subnetType: SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24 },
      ],
    });
  }
}
