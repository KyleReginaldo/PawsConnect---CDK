import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface PetLambdaProps {
  table: Table;
}

export class PetLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: PetLambdaProps) {
    super(scope, id);
    this.fn = new NodejsFunction(this, 'PetLambdaFunction', {
      entry: 'lib/handlers/pets/pet.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
  }
}
