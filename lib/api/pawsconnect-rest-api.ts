import { CfnOutput } from 'aws-cdk-lib';
import {
  ApiKey,
  ApiKeySourceType,
  Cors,
  LambdaIntegration,
  RestApi,
  UsagePlan,
} from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { PscUserPool } from '../cognito/user-pool';
import { DownloadFileLambda } from '../lambda/download-file-lambda';
import { GetProfileLambda } from '../lambda/get-profile-lambda';
import { LoginLambda } from '../lambda/login-lambda';
import { PostLambda } from '../lambda/post-lambda';
import { PostsLambda } from '../lambda/posts-lambda';
import { RegisterLambda } from '../lambda/register-lambda';
import { UploadFileLambda } from '../lambda/upload-file-lambda';
import { VerifyUserLambda } from '../lambda/verify-user-lambda';

export interface PawsConnectRestApiProps {
  postTable: Table;
  uploadTable: Table;
  profileTable: Table;
  bucket1: Bucket;
}

export class PawsConnectRestApi extends Construct {
  constructor(scope: Construct, id: string, props: PawsConnectRestApiProps) {
    super(scope, id);

    const restApi = new RestApi(this, 'PawsConnectRestApi', {
      restApiName: 'PawsConnectRestApiV1',
      description: 'This is the test rest api for paws connect.',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });
    const apiKey = new ApiKey(this, 'ApiKey');
    const userPool = new PscUserPool(this, 'PscUserPool', {});

    const usagePlan = new UsagePlan(this, 'UsagePlan', {
      name: 'Usage Plan',
      apiStages: [
        {
          api: restApi,
          stage: restApi.deploymentStage,
        },
      ],
    });
    usagePlan.addApiKey(apiKey);

    //* lambdas
    const postLambda = new PostLambda(this, 'PostLambda', {
      table: props.postTable,
    });
    const postsLambda = new PostsLambda(this, 'PostsLambda', {
      table: props.postTable,
    });
    const uploadFileLambda = new UploadFileLambda(this, 'UploadFileLambda', {
      table: props.uploadTable,
      bucket: props.bucket1,
    });
    const downloadFileLambda = new DownloadFileLambda(
      this,
      'DownloadFileLambda',
      { bucket: props.bucket1 }
    );
    const loginLambda = new LoginLambda(this, 'LoginLambda', {
      userPoolClient: userPool.userPoolClient,
    });
    const registerLambda = new RegisterLambda(this, 'RegisterLambda', {
      userPoolClient: userPool.userPoolClient,
      table: props.profileTable,
    });
    const verifyUserLambda = new VerifyUserLambda(this, 'VerifyUserLambda', {
      userPoolClient: userPool.userPoolClient,
    });
    const getProfileLambda = new GetProfileLambda(this, 'GetProfileLambda', {
      table: props.profileTable,
    });

    //*permissions hindi to AI
    props.postTable.grantReadWriteData(postLambda.fn);
    props.postTable.grantReadWriteData(postsLambda.fn);
    props.bucket1.grantPut(uploadFileLambda.fn);
    props.bucket1.grantRead(downloadFileLambda.fn);
    props.uploadTable.grantReadWriteData(uploadFileLambda.fn);
    props.profileTable.grantReadWriteData(registerLambda.fn);
    props.profileTable.grantReadData(getProfileLambda.fn);

    //*endpoints hindi rin to AI
    const posts = restApi.root.addResource('posts');
    const post = posts.addResource('{id}');
    const uploadFile = restApi.root.addResource('uploads');
    const downloadFile = restApi.root.addResource('downloads');
    const login = restApi.root.addResource('login');
    const register = restApi.root.addResource('register');
    const verifyUser = restApi.root.addResource('verify');
    const profiles = restApi.root.addResource('profile');
    const profile = profiles.addResource('{id}');

    //*integrations endpoints papunta sa lambda functions
    const postsIntegration = new LambdaIntegration(postsLambda.fn);
    const postIntegration = new LambdaIntegration(postLambda.fn);
    const uploadFileIntegration = new LambdaIntegration(uploadFileLambda.fn);
    const downloadFileIntegration = new LambdaIntegration(
      downloadFileLambda.fn
    );
    const loginIntegration = new LambdaIntegration(loginLambda.fn);
    const registerIntegration = new LambdaIntegration(registerLambda.fn);
    const verifyUserIntegration = new LambdaIntegration(verifyUserLambda.fn);
    const getProfileIntegration = new LambdaIntegration(getProfileLambda.fn);

    //*methods, handling na ng mga https methods. sa wakas!
    posts.addMethod('GET', postsIntegration, {
      apiKeyRequired: true,
    });
    posts.addMethod('POST', postsIntegration, {
      apiKeyRequired: true,
    });
    post.addMethod('GET', postIntegration, {
      apiKeyRequired: true,
    });
    post.addMethod('DELETE', postIntegration, {
      apiKeyRequired: true,
    });
    post.addMethod('PUT', postIntegration, {
      apiKeyRequired: true,
    });
    uploadFile.addMethod('POST', uploadFileIntegration, {
      apiKeyRequired: true,
    });
    downloadFile.addMethod('GET', downloadFileIntegration, {
      apiKeyRequired: true,
    });
    login.addMethod('POST', loginIntegration, {
      apiKeyRequired: false,
    });
    register.addMethod('POST', registerIntegration, {
      apiKeyRequired: false,
    });
    verifyUser.addMethod('POST', verifyUserIntegration, {
      apiKeyRequired: false,
    });
    profile.addMethod('GET', getProfileIntegration, {
      apiKeyRequired: true,
    });

    //*print or output natin tong api key para naman makuha natin yung value at magamit sa header ng api calls
    new CfnOutput(this, 'Pang output ng API Key', {
      value: apiKey.keyId,
      description: 'This is the API Key for Paws Connect Rest API',
    });
  }
}
