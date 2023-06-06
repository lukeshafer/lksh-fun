import { WebSocketApiHandler } from 'sst/node/websocket-api';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { Actions } from '@lksh-fun/core/fridge-magnets/schemas';
import { createRoom } from '@lksh-fun/core/fridge-magnets/room';
import { postToConnection } from '@lksh-fun/core/fridge-magnets/ws';

export const handler = WebSocketApiHandler(async (evt) => {
	const messageData = JSON.parse(evt.body ?? '{}').data;
	const createRoomData = Actions.createroom.parse(messageData);
	const { stage, domainName } = evt.requestContext;

	const { room, player } = await createRoom({
		connectionId: evt.requestContext.connectionId,
		name: createRoomData.name,
	});

	const apiGateway = new ApiGatewayManagementApi({
		endpoint: `${domainName}/${stage}`,
	});

	await postToConnection({
		connectionId: evt.requestContext.connectionId,
		action: 'roomcreated',
		messageData: {
			...room,
			players: [player],
		},
		apiGateway,
	});

	return {
		statusCode: 200,
	};
});
