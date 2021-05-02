import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

export const defaultTableName = 'verdaccio_configuration';

export async function getDBItem(db: DynamoDBClient): string {
  const results = await db.send(new GetItemCommand({}));

  return results?.secret;
}
