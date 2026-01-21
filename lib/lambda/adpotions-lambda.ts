import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface AdoptionsLambdaProps {
  table: Table;
}

export class AdoptionsLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: AdoptionsLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, 'AdoptionsLambdaFunction', {
      entry: 'lib/handlers/adoption/adoptions.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
  }
}
