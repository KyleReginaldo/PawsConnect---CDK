import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import z from 'zod';

const dynamodb = new DynamoDB();

export const AdoptPetSchema = z.object({
  petId: z.string(),
  userId: z.string(),
});

export async function adoptPet({ body }: { body: string | null }) {
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing request body' }),
    };
  }
  const { petId, userId } = AdoptPetSchema.parse(JSON.parse(body));
  const adoptionId = randomUUID();
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        pk: `PET#${petId}`,
        sk: `ADOPTION#${adoptionId}`,
        GSI1PK: `ADOPTION`,
        GSI1SK: `ADOPTION#${adoptionId}`,
        userId,
        adoptionStatus: 'pending',
        requestedAt: new Date().toISOString(),
      },
    })
  );
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Adoption request created',
      adoptionId,
    }),
  };
}
