import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { Table } from 'sst/node/table';
import { WebSocketApiHandler } from 'sst/node/websocket-api';

const TableName = Table.Connections.tableName;
const dynamoDb = new DynamoDB.DocumentClient();

export const handler = WebSocketApiHandler(async (evt) => {
	const messageData = JSON.parse(evt.body ?? '{}').data;
	const { stage, domainName } = evt.requestContext;

	// Get all the connections
	const connections = await dynamoDb.scan({ TableName, ProjectionExpression: 'id' }).promise();
	console.log('Connections:', connections);

	const apiG = new ApiGatewayManagementApi({
		endpoint: `${domainName}/${stage}`,
	});

	const postToConnection = async function({ id }: { id: string }) {
		try {
			// Send the message to the given client
			await apiG.postToConnection({ ConnectionId: id, Data: messageData }).promise();
			console.log('Message sent to:', id);
		} catch (e) {
			console.log('Error sending message:', e);
			if (e?.statusCode === 410) {
				// Remove stale connections
				await dynamoDb.delete({ TableName, Key: { id } }).promise();
			}
		}
	};

	// Iterate through all the connections
	await Promise.all(connections.Items?.map(postToConnection));

	return { statusCode: 200, body: 'Message sent' };
});
