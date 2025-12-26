import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib/core';
import { RemovalPolicy } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { PawsConnectRestApi } from './api/pawsconnect-rest-api';
import { PsBucket1 } from './s3/ps-bucket1';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TrialCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const postTable = new Table(this, 'PostTable', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    const uploadTable = new Table(this, 'UploadTable', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const profileTable = new Table(this, 'ProfileTable', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const bucket1 = new PsBucket1(this, 'PsBucket1', {});

    new PawsConnectRestApi(this, 'PawsConnectRestApi', {
      postTable,
      uploadTable,
      profileTable,
      bucket1: bucket1.bucket,
    });
  }
}
