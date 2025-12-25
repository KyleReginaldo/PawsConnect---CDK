import { UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface LoginLambdaProps {
  userPoolClient: UserPoolClient;
}

export class LoginLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: LoginLambdaProps) {
    super(scope, id);
    console.log(
      `user pool client id: ${props.userPoolClient.userPoolClientId}`
    );
    this.fn = new NodejsFunction(this, 'LoginLambdaFunction', {
      entry: 'lib/handlers/login.ts',
      handler: 'handler',
      environment: {
        CLIENT_ID: props.userPoolClient.userPoolClientId,
      },
      bundling: {
        forceDockerBundling: false,
      },
    });
  }
}
