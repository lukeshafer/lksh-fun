import { Room, db } from './db';
import type { EntityItem } from 'electrodb';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateRoomIdSingle() {
	let result = '';
	for (let i = 0; i < 4; i++) {
		result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
	}
	return result;
}

// 1. Get room IDs already registered with the Presence API.
// 2. Generate room IDs until you generate one that is not already used.
// 3. Register the new room ID with the Presence API.
export async function generateRoomId() {
	let id: string;
	do {
		id = generateRoomIdSingle();
	} while (
		await Room.query
			.primary({ roomId: id })
			.go()
			.then((r) => r.data.length > 0)
	);
	return id;
}

export async function createRoom(opts: { connectionId: string; name: string }) {
	const roomId = await generateRoomId();

	await db.transaction
		.write(({ Room, Player }) => [
			Room.create({ roomId: roomId }).commit(),
			Player.create({
				roomId: roomId,
				connectionId: opts.connectionId,
				name: opts.name,
			}).commit(),
		])
		.go();
}

export async function joinRoom(opts: {
	roomId: string;
	connectionId: string;
	name: string;
}) {
	const room = await Room.query
		.primary({ roomId: opts.roomId })
		.go()
		.then((res) => res.data[0] as EntityItem<typeof Room> | undefined);

	if (!room) {
		console.log(`Room ${opts.roomId} not found`);
		return;
	}

	await db.transaction
		.write(({ Player }) => [
			Player.create({
				roomId: room.roomId,
				connectionId: opts.connectionId,
				name: opts.name,
			}).commit(),
		])
		.go();
}
