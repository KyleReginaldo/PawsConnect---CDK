import { UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface RegisterLambdaProps {
  userPoolClient: UserPoolClient;
  table: Table;
}

export class RegisterLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: RegisterLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, 'RegisterLambdaFunction', {
      entry: 'lib/handlers/register.ts',
      handler: 'handler',
      environment: {
        CLIENT_ID: props.userPoolClient.userPoolClientId,
        TABLE_NAME: props.table.tableName,
      },
      bundling: {
        forceDockerBundling: false,
      },
    });
  }
}
