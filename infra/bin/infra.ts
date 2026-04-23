#!/usr/bin/env -S pnpm exec tsx
import "source-map-support/register";
import { App, Tags } from "aws-cdk-lib";
import { NetworkStack } from "../lib/stacks/network-stack";
import { DataStack } from "../lib/stacks/data-stack";
import { ApiStack } from "../lib/stacks/api-stack";
import { WebStack } from "../lib/stacks/web-stack";

/**
 * Piramid Providers infrastructure.
 *
 * One AWS account per env. Stacks:
 *   NetworkStack   – VPC with public + private subnets.
 *   DataStack      – S3 evidencias + DB secrets placeholder (RDS connection
 *                    lives here when we move off SQLite / Planetscale).
 *   ApiStack       – ECS Fargate + ALB running @piramid/api from ECR.
 *   WebStack       – S3 static bucket + CloudFront for @piramid/web export.
 *
 * All exports keep the stacks loosely coupled so each can be `cdk deploy`-ed
 * on its own. Sentry/log forwarding is wired via env vars injected into the
 * Fargate task — not infra responsibility beyond the secret arns.
 */

const app = new App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
};

const stageName = app.node.tryGetContext("stage") ?? "dev";
const prefix = `piramid-${stageName}`;

const network = new NetworkStack(app, `${prefix}-network`, { env });

const data = new DataStack(app, `${prefix}-data`, {
  env,
  stageName,
  vpc: network.vpc,
});

const api = new ApiStack(app, `${prefix}-api`, {
  env,
  stageName,
  vpc: network.vpc,
  uploadsBucket: data.uploadsBucket,
  dbSecret: data.dbSecret,
});

const web = new WebStack(app, `${prefix}-web`, {
  env,
  stageName,
  apiDomain: api.albDnsName,
});

Tags.of(app).add("project", "piramid-providers");
Tags.of(app).add("stage", stageName);
Tags.of(app).add("managed-by", "cdk");

// Touch unused vars so TS doesn't complain and so the graph is exported.
void web;
