import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as elasticache from "aws-cdk-lib/aws-elasticache";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define a VPC with 2 subnets (1 private, 1 public)
    const vpc = new ec2.Vpc(this, "Vpc", {
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: "Public",
          cidrMask: 24,
          mapPublicIpOnLaunch: true,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          name: "Private",
          cidrMask: 24,
        },
      ],
    });

    // security group for the EC2 instance, allows SSH and HTTP
    const ec2SecGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc,
      securityGroupName: "ssh-http-security-group",
      description: "Enable SSH and HTTP access via port 22 and 80",
      allowAllOutbound: true,
    });

    ec2SecGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "SSH from anywhere"
    );
    ec2SecGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "HTTP from anywhere"
    );

    // RDS instance security group
    const rdsSecGroup = new ec2.SecurityGroup(this, "RDSSecurityGroup", {
      vpc,
      securityGroupName: "rds-security-group",
      description: "Enable access to RDS from the EC2 instance",
    });

    rdsSecGroup.addIngressRule(
      ec2SecGroup,
      ec2.Port.tcp(3306),
      "MySQL access from EC2"
    );

    // Elasticache redis cluster security group
    const redisSecGroup = new ec2.SecurityGroup(this, "RedisSecurityGroup", {
      vpc,
      securityGroupName: "redis-security-group",
      description: "Enable access to Redis from the EC2 instance",
    });

    redisSecGroup.addIngressRule(
      ec2SecGroup,
      ec2.Port.tcp(6379),
      "Redis access from EC2"
    );

    // Define an EC2 instance in the VPC with the security group attached
    const instance = new ec2.Instance(this, "Instance", {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: ec2.AmazonLinuxCpuType.X86_64,
      }),
      securityGroup: ec2SecGroup,
      vpcSubnets: {
        subnets: [vpc.publicSubnets[0]],
      },
    });

    // Assign an Elastic IP to the instance
    new ec2.CfnEIP(this, "EIP", { instanceId: instance.instanceId });

    // RDS instance
    const database = new rds.DatabaseInstance(this, "Database", {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.of("8.0.31", "8.0"),
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      securityGroups: [rdsSecGroup],
      credentials: {
        username: "bruhmin",
        password: cdk.SecretValue.unsafePlainText("bruhzzzzz!"),
      },
    });

    // Elasticache redis cluster
    const elastiCacheCluster = new elasticache.CfnCacheCluster(
      this,
      "RedisCluster",
      {
        engine: "redis",
        engineVersion: "7.0",
        cacheNodeType: "cache.t2.micro",
        numCacheNodes: 1,
        vpcSecurityGroupIds: [redisSecGroup.securityGroupId],
      }
    );

    // output the id of major resources, and also the public IP of the EC2 instance.
    new cdk.CfnOutput(this, "EC2InstancePublicIp", {
      value: instance.instancePublicIp,
    });

    new cdk.CfnOutput(this, "DatabaseIdentifier", {
      value: database.instanceIdentifier,
    });

    new cdk.CfnOutput(this, "RedisClusterId", {
      value: elastiCacheCluster.ref,
    });

    new cdk.CfnOutput(this, "VpcId", {
      value: vpc.vpcId,
    });

    new cdk.CfnOutput(this, "Ec2InstanceId", {
      value: instance.instanceId,
    });
  }
}
