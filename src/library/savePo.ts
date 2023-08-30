import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../../../.env` });

export const DbCredentials = {
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

export const Tables = {
  PurchaseOrderItems: 'PurchaseOrderItems',
};

export const savePOItem = async (item) => {
  const client = new DynamoDBClient(DbCredentials);
  const dynamo = DynamoDBDocumentClient.from(client);

  await dynamo.send(
    new PutCommand({
      TableName: Tables.PurchaseOrderItems,
      Item: item,
    }),
  );
  return item;
};
