import { type StackContext, WebSocketApi as SSTWebSocketApi, Table } from 'sst/constructs';

export function WebSocketApi({ stack }: StackContext) {
	const connectionsTable = new Table(stack, 'Connections', {
		fields: {
			id: 'string',
		},
		primaryIndex: { partitionKey: 'id' },
	});

	const fridgeMagnetsApi = new SSTWebSocketApi(stack, 'FridgeMagnetsApi', {
		defaults: {
			function: {
				bind: [connectionsTable],
			},
		},
		routes: {
			$connect: 'packages/functions/src/fridge-magnets/connect.handler',
			$disconnect: 'packages/functions/src/fridge-magnets/disconnect.handler',
			sendmessage: 'packages/functions/src/fridge-magnets/send-message.handler',
			joinroom: 'packages/functions/src/fridge-magnets/join-room.handler',
			createroom: 'packages/functions/src/fridge-magnets/create-room.handler',
		},
	});
	stack.addOutputs({
		FridgeMagnetsApiEndpoint: fridgeMagnetsApi.url,
	});

	return fridgeMagnetsApi;
}
