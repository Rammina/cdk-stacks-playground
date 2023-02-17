import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as autoscaling from "aws-cdk-lib/aws-autoscaling";
import { Duration } from "aws-cdk-lib";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Resources
    const stackDefaultVpc = ec2.Vpc.fromLookup(this, "VPC", {});

    const instanceSecurityGroup = new ec2.SecurityGroup(
      this,
      "InstanceSecurityGroup",
      {
        vpc: stackDefaultVpc,
      }
    );
    instanceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP"
    );

    const elbSecurityGroup = new ec2.SecurityGroup(this, "ElbSecurityGroup", {
      vpc: stackDefaultVpc,
    });
    elbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP"
    );
    elbSecurityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.allTcp(),
      "Allow all outbound"
    );

    const elb = new elbv2.ApplicationLoadBalancer(this, "Elb", {
      securityGroup: elbSecurityGroup,
      vpc: stackDefaultVpc,
      internetFacing: true,
    });

    const targetGroup = new elbv2.ApplicationTargetGroup(this, "TargetGroup", {
      port: 80,
      healthCheck: {
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
        timeout: Duration.seconds(3),
        interval: Duration.seconds(30),
        path: "/health",
      },
    });

    const listener = elb.addListener("Listener", {
      port: 80,
      defaultAction: elbv2.ListenerAction.forward([targetGroup]),
    });

    const launchTemplate = new ec2.LaunchTemplate(this, "LaunchTemplate", {
      machineImage: new ec2.AmazonLinuxImage(),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      securityGroup: instanceSecurityGroup,
    });

    const asg = new autoscaling.AutoScalingGroup(this, "AutoscalingGroup", {
      launchTemplate,
      vpc: stackDefaultVpc,
    });
    asg.attachToApplicationTargetGroup(targetGroup);
  }
}
