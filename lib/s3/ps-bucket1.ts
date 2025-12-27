import { RemovalPolicy } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface PsBucket1Props {}

export class PsBucket1 extends Construct {
  public readonly bucket: Bucket;
  constructor(scope: Construct, id: string, props: PsBucket1Props) {
    super(scope, id);

    this.bucket = new Bucket(this, 'PsBucket1', {
      bucketName: 'paws-connect-bucket1',
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [HttpMethods.PUT, HttpMethods.GET, HttpMethods.POST],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });
  }
}
