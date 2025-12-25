import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface PostLambdaProps {
    table: Table;
}

export class PostLambda extends Construct {
 public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: PostLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, 'PostLambda', {
        entry: 'lib/handlers/posts/post.ts',
        handler: 'handler',
        environment: {
            TABLE_NAME: props.table.tableName,
        },
        bundling: {
            forceDockerBundling: false,
        }
    });
    
  }
}