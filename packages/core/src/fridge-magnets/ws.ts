import type { ApiGatewayManagementApi, AWSError } from 'aws-sdk';
import { WSConnection } from './db';
import type { ServerAction, ServerActionData } from './schemas';

export async function postToConnection<T extends ServerAction>(opts: {
	connectionId: string;
	apiGateway: ApiGatewayManagementApi;
	action: T;
	messageData: ServerActionData<T>;
}) {
	try {
		// Send the message to the given client
		await opts.apiGateway
			.postToConnection({
				ConnectionId: opts.connectionId,
				Data: JSON.stringify({
					action: opts.action,
					data: opts.messageData,
				}),
			})
			.promise();
		console.log('Message sent to:', opts.connectionId);
	} catch (e) {
		console.log('Error sending message:', e);
		//@ts-ignore
		if (e?.statusCode === 410) {
			// Remove stale connections
			await WSConnection.delete({
				connectionId: opts.connectionId,
			}).go();
		}
	}
}
