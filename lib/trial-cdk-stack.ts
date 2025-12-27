import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib/core';
import { RemovalPolicy } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { PawsConnectRestApi } from './api/pawsconnect-rest-api';
import { PsBucket1 } from './s3/ps-bucket1';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TrialCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pawsConnectTable = new Table(this, 'PawsConnectTable', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },

      tableName: 'paws-connect-table',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    pawsConnectTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {
        name: 'GSI1PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1SK',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    const bucket1 = new PsBucket1(this, 'PsBucket1', {});

    new PawsConnectRestApi(this, 'PawsConnectRestApi', {
      table: pawsConnectTable,
      bucket1: bucket1.bucket,
    });
  }
}
