import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent } from "aws-lambda";

const s3 = new S3Client();


export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const key = event.queryStringParameters?.key;

        if(!key) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing key parameter" }),
            };
        }

        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: key,
            ResponseContentDisposition: "inline",
        });

        const downloadUrl = await getSignedUrl(s3, command, {
            expiresIn: 60 * 5,
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({ downloadUrl }),
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
 }