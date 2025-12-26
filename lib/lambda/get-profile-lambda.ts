import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface GetProfileLambdaProps {
  table: Table;
}

export class GetProfileLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: GetProfileLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, 'GetProfileLambdaFunction', {
      entry: 'lib/handlers/profile/get-profile.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
      bundling: {
        forceDockerBundling: false,
      },
    });
  }
}
