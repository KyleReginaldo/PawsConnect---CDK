import { UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface VerifyUserLambdaProps {
  userPoolClient: UserPoolClient;
}

export class VerifyUserLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: VerifyUserLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, 'VerifyUserLambdaFunction', {
      entry: 'lib/handlers/verify-user.ts',
      handler: 'handler',
      bundling: {
        forceDockerBundling: false,
      },
      environment: {
        CLIENT_ID: props.userPoolClient.userPoolClientId,
      },
    });
  }
}
