import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface UploadFileLambdaProps {
    table: Table;
    bucket: Bucket;
}

export class UploadFileLambda extends Construct {
    public readonly fn: NodejsFunction;
    constructor(scope: Construct, id: string, props: UploadFileLambdaProps) {
        super(scope, id);

        this.fn = new NodejsFunction(this, 'UploadFileLambda', {
            entry: 'lib/handlers/upload/upload-file.ts',
            handler: 'handler',
            environment: {
                TABLE_NAME: props.table.tableName,
                BUCKET_NAME: props.bucket.bucketName,
            },
            bundling: {
                forceDockerBundling: false,
            }
        });        
    }
}