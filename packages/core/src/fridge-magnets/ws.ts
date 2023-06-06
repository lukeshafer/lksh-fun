import type { ApiGatewayManagementApi, AWSError } from 'aws-sdk';
import { WSConnection } from './db';

const serverActions = ['players', 'message', 'room'] as const;

export async function postToConnection(opts: {
	connectionId: string;
	apiG: ApiGatewayManagementApi;
	messageData: any;
	action: (typeof serverActions)[number];
}) {
	try {
		// Send the message to the given client
		await opts.apiG
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
