import { DynamoDB } from 'aws-sdk';
import { Table } from 'sst/node/table';
import { WebSocketApiHandler } from 'sst/node/websocket-api';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = WebSocketApiHandler(async (evt) => {
	const params = {
		TableName: Table.Connections.tableName,
		Item: {
			id: evt.requestContext.connectionId,
		},
	};

	await dynamoDb.put(params).promise();

	return {
		statusCode: 200,
		body: 'Connected.',
	};
});
