import { Duration } from 'aws-cdk-lib';
import {
  AccountRecovery,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';

import { Construct } from 'constructs';

export interface PscUserPoolProps {}

export class PscUserPool extends Construct {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;
  constructor(scope: Construct, id: string, props: PscUserPoolProps) {
    super(scope, id);

    this.userPool = new UserPool(this, 'PawsConnectUserPool', {
      userPoolName: 'PawsConnectUserPool',
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      signInAliases: {
        email: true,
        phone: false,
        username: false,
        preferredUsername: false,
      },
    });
    this.userPoolClient = this.userPool.addClient('PawsConnectUserPoolClient', {
      authFlows: {
        userPassword: true,
      },
      idTokenValidity: Duration.days(1),
      refreshTokenValidity: Duration.days(30),
    });
  }
}
