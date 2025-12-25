import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface PostsLambdaProps {
    table: Table;
}

export class PostsLambda extends Construct {
    public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: PostsLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this,'PostsLambda', {
        entry: 'lib/handlers/posts/posts.ts',
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