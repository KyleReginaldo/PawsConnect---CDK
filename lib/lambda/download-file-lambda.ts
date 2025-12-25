import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface DownloadFileLambdaProps {
    bucket: Bucket;
}

export class DownloadFileLambda extends Construct {
    public readonly fn: NodejsFunction;
    constructor(scope: Construct, id: string, props: DownloadFileLambdaProps) {
        super(scope, id);

        this.fn = new NodejsFunction(this, 'DownloadFileLambda', {
            entry: 'lib/handlers/download/download-file.ts',
            handler: 'handler',
            environment: {
                BUCKET_NAME: props.bucket.bucketName,
            },
            bundling: {
                forceDockerBundling: false,
            }
        });
    }
}