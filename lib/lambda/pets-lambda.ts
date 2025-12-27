import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface PetsLambdaProps {
  table: Table;
}

export class PetsLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: PetsLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, 'PetsLambdaFunction', {
      entry: 'lib/handlers/pets/pets.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
  }
}
