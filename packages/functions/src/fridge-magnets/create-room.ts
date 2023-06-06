import { WebSocketApiHandler } from 'sst/node/websocket-api';
import { Actions } from '@lksh-fun/core/fridge-magnets/schemas';
import { createRoom } from '@lksh-fun/core/fridge-magnets/room';

export const handler = WebSocketApiHandler(async (evt) => {
	const messageData = JSON.parse(evt.body ?? '{}').data;
	const createRoomData = Actions.createroom.parse(messageData);

	await createRoom({
		connectionId: evt.requestContext.connectionId,
		name: createRoomData.name,
	});

	// TODO: either create a hook when the DB updates to emit events, or do it here

	return {
		statusCode: 200,
	};
});
