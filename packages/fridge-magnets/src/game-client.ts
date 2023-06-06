import {
	Room,
	type ClientAction,
	type ClientActionData,
	type ServerAction,
	ServerActions,
} from '@lksh-fun/core/fridge-magnets/schemas';
import { safeJSONParse } from '@lksh-fun/core/utils';
import { state, setState } from './state';

/**
 * A class that represents a connection to the game server.
 * @example
 * const client = new GameClient('ws://localhost:8080');
 * await client.connect();
 */
export class GameClient {
	url: string;
	private ws: WebSocket | undefined;
	constructor(
		url: string,
		options: {
			onopen?: (ws: WebSocket) => void;
			onclose?: () => void;
		} = {}
	) {
		this.url = url;
		if (options.onopen) this.onopen = options.onopen;
		if (options.onclose) this.onclose = options.onclose;
		this.ws = new WebSocket(this.url);
	}

	/**
	 * Returns a promise that resolves when the connection is opened.
	 *
	 * Note: The client connects automatically when it is created, so this method is only
	 * useful if you need to wait for the connection to be opened.
	 * */
	async connect() {
		return new Promise<void>((resolve) => {
			if (!this.ws) throw new Error('WebSocket is not defined');
			this.ws.onopen = () => {
				console.debug('WebSocket connection opened');
				this.onopen?.(this.ws!);
				resolve();
			};

			this.ws.onmessage = this.handleMessage;

			this.ws.onerror = (error) => {
				console.error('WebSocket error:', error);
			};

			this.ws.onclose = () => {
				console.debug('WebSocket connection closed');
			};
		});
	}

	private onopenCallbacks: ((ws: WebSocket) => void)[] = [];
	set onopen(onopen: (ws: WebSocket) => void) {
		if (!this.ws) this.onopenCallbacks.push(onopen);
		else if (this.ws.readyState === WebSocket.OPEN) onopen(this.ws);
		else this.onopenCallbacks.push(onopen);
	}

	private oncloseCallbacks: (() => void)[] = [];
	set onclose(onclose: () => void) {
		if (!this.ws) this.oncloseCallbacks.push(onclose);
		else if (this.ws.readyState === WebSocket.CLOSED) onclose();
		else this.oncloseCallbacks.push(onclose);
	}

	disconnect() {
		this.ws?.close();
	}

	send<T extends ClientAction>(action: T, data: ClientActionData<T>) {
		this.ws?.send(JSON.stringify({ action, data }));
	}

	private roomJoinedResolve: ((room: Room) => void) | undefined;
	async joinRoom(args: { roomId: string; name: string }): Promise<Room> {
		sessionStorage.setItem('name', args.name);
		this.send('joinroom', args);
		return new Promise((resolve) => {
			this.roomJoinedResolve = resolve;
		});
	}

	private roomCreatedResolve: ((room: Room) => void) | undefined;
	async createRoom(args: { name: string }): Promise<Room> {
		sessionStorage.setItem('name', args.name);
		this.send('createroom', args);
		return new Promise((resolve) => {
			this.roomCreatedResolve = resolve;
		});
	}

	async tryRejoiningRoom(roomId: string) {
		const name = sessionStorage.getItem('name');
		if (!name) return;

		this.send('joinroom', { roomId, name });
		return new Promise((resolve) => {
			this.roomJoinedResolve = resolve;
		});
	}

	async ping(msg: string) {
		this.send('sendmessage', msg);
	}

	private subscriptionHandlers: Map<ClientAction, Set<() => void>> =
		new Map();
	private handleMessage(event: MessageEvent) {
		console.debug('WebSocket message received:', event.data);
		const data = safeJSONParse(event.data);
		if (
			!data ||
			!(typeof data === 'object') ||
			!('action' in data) ||
			typeof data.action !== 'string' ||
			!('data' in data)
		)
			return;

		const action = data.action;

		if (!this.checkIsServerAction(action)) return;

		switch (action) {
			case 'roomcreated':
				const roomCreatedSchema = ServerActions[action];
				if (!roomCreatedSchema) return;
				const createdRoom = roomCreatedSchema.parse(data.data);
				setState({ room: createdRoom });
				this.roomCreatedResolve?.(createdRoom);
				break;
			case 'roomjoined':
				const roomJoinedSchema = ServerActions[action];
				if (!roomJoinedSchema) return;
				const joinedRoom = roomJoinedSchema.parse(data.data);
				setState({ room: joinedRoom });
				this.roomJoinedResolve?.(joinedRoom);
				break;
			case 'playerjoined':
				break;
			case 'message':
				const messageSchema = ServerActions[action];
				if (!messageSchema) return;
				const message = messageSchema.parse(data.data);

				console.log(message);
				break;
		}
	}

	private checkIsServerAction(action: string): action is ServerAction {
		return action in ServerActions;
	}

	subscribe(action: ClientAction, callback: () => void) {
		if (!this.subscriptionHandlers.has(action))
			this.subscriptionHandlers.set(action, new Set());
		this.subscriptionHandlers.get(action)?.add(callback);
	}
}
