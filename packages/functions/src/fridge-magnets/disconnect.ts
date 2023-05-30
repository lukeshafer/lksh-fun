import { DynamoDB } from 'aws-sdk';
import { Table } from 'sst/node/table';
import { WebSocketApiHandler } from 'sst/node/websocket-api';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = WebSocketApiHandler(async (evt) => {
	const params = {
		TableName: Table.Connections.tableName,
		Key: {
			id: evt.requestContext.connectionId,
		},
	};

	await dynamoDb.delete(params).promise();

	return {
		statusCode: 200,
		body: 'Disconnected.',
	};
});
