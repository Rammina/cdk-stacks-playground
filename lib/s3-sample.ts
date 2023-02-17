import * as cdk from "aws-cdk-lib";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";

export class CdkWorkshopStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // create S3 bucket
        const myS3Bucket = new Bucket(this, "MyS3Bucket", {
            bucketName: "my-s3-bucket",
            publicReadAccess: true,
            encryption: BucketEncryption.S3_MANAGED
        });
    }
}