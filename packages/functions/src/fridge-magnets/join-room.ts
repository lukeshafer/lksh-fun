import { WebSocketApiHandler } from 'sst/node/websocket-api';
import { Room, Player } from '@lksh-fun/core/fridge-magnets/db';
import { Actions } from '@lksh-fun/core/fridge-magnets/schemas';
import { generateRoomId } from '@lksh-fun/core/fridge-magnets/room';

export const handler = WebSocketApiHandler(async (evt) => {
	const messageData = JSON.parse(evt.body ?? '{}').data;
	const createRoomData = Actions.joinroom.parse(messageData);

	const room = await Room.query
		.primary({ roomId: createRoomData.roomId })
		.go()
		.then((res) => res.data[0] as Room | undefined));

	if (!room) {
		console.log(`Room ${createRoomData.roomId} not found`);
		return {
			statusCode: 404,
		};
	}

	await Player.create({
		roomId: room.roomId,
		connectionId: evt.requestContext.connectionId,
		name: createRoomData.name,
	});
	return {
		statusCode: 200,
	};
});
