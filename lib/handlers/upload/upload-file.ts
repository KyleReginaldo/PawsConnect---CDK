import { DynamoDB, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent } from "aws-lambda";
import { randomUUID } from "crypto";
import { z } from "zod";
const s3 = new S3Client();
const dynamodb = new DynamoDB();

export const UploadSchema = z.object({
    fileName: z.string(),
    contentType: z.string(),
});

const ALLOWED_TYPES: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
}

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const bodyParsed = UploadSchema.safeParse(JSON.parse(event.body??'{}'));
        if(!bodyParsed.success){
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid request body" }),
            }
        }else{
            const {fileName,contentType} = bodyParsed.data;
            const extension = ALLOWED_TYPES[contentType];
            if(!extension){
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Unsupported file type" }),
                }
            }
            const uuid = randomUUID();
            const key = `files/${uuid}.${extension}`;
            
            const command = new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: key,
                ContentType: contentType,
            });

            const uploadUrl = await getSignedUrl(s3, command, {
                expiresIn: 60 * 5,
            });

            await dynamodb.send(new PutItemCommand({
                TableName: process.env.TABLE_NAME,
                Item: {
                    pk: { S: uuid},
                    key: {
                        S: key
                    },
                    contentType: {
                        S: contentType,
                    },
                    createdAt: {
                        S: new Date().toISOString(),
                    }
                }
            }));
            return {
                statusCode: 200,
                body: JSON.stringify({
                    uploadUrl,
                    id: uuid,
                    key,
                }),
            }
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request body" }),
        }
    }
}