import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as autoscaling from "aws-cdk-lib/aws-autoscaling";
import * as s3 from "aws-cdk-lib/aws-s3";
import { readFileSync } from "fs";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Resources
    // Define a VPC with 2 subnets (1 private, 1 public)
    const vpc = new ec2.Vpc(this, "Vpc", {
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: "Public1",
          cidrMask: 24,
          mapPublicIpOnLaunch: true,
        },
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: "Public2",
          cidrMask: 24,
          mapPublicIpOnLaunch: true,
        },
        {
          // private subnet is outbound only
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          name: "Private",
          cidrMask: 24,
        },
      ],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    // Security group for EC2 instances (allows HTTP and SSH)
    const instanceSecurityGroup = new ec2.SecurityGroup(
      this,
      "InstanceSecurityGroup",
      {
        vpc,
        allowAllOutbound: true,
      }
    );
    instanceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP"
    );
    instanceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH"
    );

    // Security group for the Application Load Balancer (allows HTTP and SSH, allows all egress)
    const elbSecurityGroup = new ec2.SecurityGroup(this, "ElbSecurityGroup", {
      vpc,
      allowAllOutbound: true,
    });
    elbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP"
    );
    elbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH"
    );

    // Internet-facing Application Load Balancer in the public subnets
    const elb = new elbv2.ApplicationLoadBalancer(this, "Elb", {
      securityGroup: elbSecurityGroup,
      vpc,
      vpcSubnets: {
        subnets: [vpc.publicSubnets[0], vpc.publicSubnets[1]],
      },
      internetFacing: true,
    });

    // S3 bucket for storing ALB access logs
    const logsBucket = new s3.Bucket(this, "LogsBucket");
    elb.logAccessLogs(logsBucket);

    // Target group for the ALB, adds EC2 instances
    const targetGroup = new elbv2.ApplicationTargetGroup(this, "TargetGroup", {
      port: 80,
      vpc,
      targetType: elbv2.TargetType.INSTANCE,
    });

    const listener = elb.addListener("Listener", {
      port: 80,
      defaultAction: elbv2.ListenerAction.forward([targetGroup]),
    });

    // load user data script from file
    const userDataScript = readFileSync("./sh/user-data.sh", "utf8");

    // Launch template for the instance configuration: Amazon Linux 2, t2.micro and init script
    const launchTemplate = new ec2.LaunchTemplate(this, "LaunchTemplate", {
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: ec2.AmazonLinuxCpuType.X86_64,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      securityGroup: instanceSecurityGroup,
      // add user data script to run for every instance, sets up httpd/Apache Web server and dependencies
      userData: ec2.UserData.custom(userDataScript),
    });

    // prolonged grace period to allow EC2 instances sometime to start up before health checks begin
    const healthCheck = autoscaling.HealthCheck.ec2({
      grace: cdk.Duration.minutes(30),
    });

    // Auto Scaling Group
    const asg = new autoscaling.AutoScalingGroup(this, "AutoscalingGroup", {
      launchTemplate,
      vpc,
      vpcSubnets: {
        subnets: [vpc.publicSubnets[0], vpc.publicSubnets[1]],
      },
      // update the capacity values as necessary
      minCapacity: 2,
      desiredCapacity: 2,
      maxCapacity: 3,
      healthCheck,
    });
    // register the target group with the ASG so the instances can receive traffic
    asg.attachToApplicationTargetGroup(targetGroup);

    // outputs for resources that other stacks can use
    new cdk.CfnOutput(this, "VpcName", { value: vpc.vpcId });
    new cdk.CfnOutput(this, "ASGName", { value: asg.autoScalingGroupName });
    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: elb.loadBalancerDnsName,
    });
  }
}
