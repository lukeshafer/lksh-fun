import { ApiGatewayManagementApi } from 'aws-sdk';
import { WebSocketApiHandler } from 'sst/node/websocket-api';
import { WSConnection } from '@lksh-fun/core/fridge-magnets/db';
import { postToConnection } from '@lksh-fun/core/fridge-magnets/ws';

export const handler = WebSocketApiHandler(async (evt) => {
	const messageData = JSON.parse(evt.body ?? '{}').data;
	const { stage, domainName } = evt.requestContext;

	// Get all the connections
	const connections = await WSConnection.scan.go();

	const apiG = new ApiGatewayManagementApi({
		endpoint: `${domainName}/${stage}`,
	});

	// Iterate through all the connections
	await Promise.all(
		connections.data.map(({ connectionId }) =>
			postToConnection({
				connectionId,
				apiG,
				messageData,
				action: 'message',
			})
		)
	);

	return { statusCode: 200, body: 'Message sent' };
});
