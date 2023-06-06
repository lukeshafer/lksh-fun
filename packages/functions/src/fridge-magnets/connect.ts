import { WebSocketApiHandler } from 'sst/node/websocket-api';
import { WSConnection } from '@lksh-fun/core/fridge-magnets/db';

export const handler = WebSocketApiHandler(async (evt) => {
	await WSConnection.put({
		connectionId: evt.requestContext.connectionId,
	}).go();

	return {
		statusCode: 200,
		body: 'Connected.',
	};
});
