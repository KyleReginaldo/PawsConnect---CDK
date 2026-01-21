import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface AdoptionLambdaProps {
  table: Table;
}

export class AdoptionLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: AdoptionLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, 'AdoptionLambdaFunction', {
      entry: 'lib/handlers/adoption/adoption.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
  }
}
