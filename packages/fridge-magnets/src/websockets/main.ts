type Action = keyof ActionData;

interface ActionData {
	sendmessage: string;
}

function getConnectionObj(ws: WebSocket) {
	return {
		send: <T extends Action>(action: T, data: ActionData[T]) => {
			ws.send(JSON.stringify({ action, data }));
		},
		disconnect: () => {
			ws.close();
		},
	};
}

type Connection = ReturnType<typeof getConnectionObj>;

export function connect(url: string, onopen?: (ws: WebSocket) => void) {
	return new Promise<Connection>((resolve) => {
		const ws = new WebSocket(url);

		ws.onopen = () => {
			console.log('WebSocket connection opened');
			onopen?.(ws);
			resolve(getConnectionObj(ws));
		};

		ws.onmessage = handleMessage;

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		ws.onclose = () => {
			console.log('WebSocket connection closed');
		};
	});
}

function handleMessage(event: MessageEvent) {
	console.log('WebSocket message received:', event.data);
}
