import { type StackContext, WebSocketApi as SSTWebSocketApi, Table } from 'sst/constructs';

export function FridgeMagnetsStack({ stack }: StackContext) {
	const table = new Table(stack, 'FridgeMagnets', {
		fields: {
			pk: 'string',
			sk: 'string',
		},
		primaryIndex: {
			partitionKey: 'pk',
			sortKey: 'sk',
		},
	});

	const wsApi = new SSTWebSocketApi(stack, 'FridgeMagnetsApi', {
		defaults: {
			function: {
				bind: [table],
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
		FridgeMagnetsApiEndpoint: wsApi.url,
	});

	return {
		wsApi,
		table,
	};
}
