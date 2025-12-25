import { UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export interface RegisterLambdaProps {
  userPoolClient: UserPoolClient;
}

export class RegisterLambda extends Construct {
  public readonly fn: NodejsFunction;
  constructor(scope: Construct, id: string, props: RegisterLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, 'RegisterLambdaFunction', {
      entry: 'lib/handlers/register.ts',
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
