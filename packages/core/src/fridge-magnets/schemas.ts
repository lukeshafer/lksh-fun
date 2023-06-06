import { z } from 'zod';

export const Actions = {
	// Client -> Server
	sendmessage: z.string(),
	joinroom: z.object({
		roomId: z.string(),
		name: z.string(),
	}),
	createroom: z.object({
		name: z.string(),
	}),
	leaveroom: z.object({
		roomId: z.string(),
	}),
	startgame: z.object({
		roomId: z.string(),
	}),
} as const satisfies Record<string, z.ZodType<any, any>>;
export type ClientAction = keyof typeof Actions;
export type ClientActionData<T extends ClientAction> = z.infer<
	(typeof Actions)[T]
>;

export type Piece = z.infer<typeof pieceSchema>;
export const pieceSchema = z.object({
	word: z.string(),
	id: z.number(),
	x: z.number(),
	y: z.number(),
});

export const playerStatuses = ['editing', 'waiting', 'finished'] as const;
export type PlayerStatus = (typeof playerStatuses)[number];

export type Player = z.infer<typeof playerSchema>;
export const playerSchema = z.object({
	connectionId: z.string(),
	name: z.string(),
	//hand: z.array(pieceSchema),
	isVIP: z.boolean(),
	status: z.enum(playerStatuses),
	//submission: z.array(pieceSchema),
	isConnected: z.boolean(),
});

export type PromptCard = z.infer<typeof promptCardSchema>;
export const promptCardSchema = z.object({
	prompt: z.string(),
	id: z.number(),
});

export const gamePhases = [
	'lobby',
	'playing',
	'showcase',
	'resetting',
] as const;

export type Room = z.infer<typeof roomSchema>;
export const roomSchema = z.object({
	roomId: z.string(),
	phase: z.enum(gamePhases),
	turn: z.number(),
	players: z.array(playerSchema),
	//currentPrompt: promptCardSchema,
	showcaseId: z.string(),
});

export const ServerActions = {
	// Server -> Client
	roomcreated: roomSchema,
	roomjoined: roomSchema,
	roomupdated: roomSchema,
	playerjoined: playerSchema,
	playerleft: z.string({ description: 'player name' }),
	playerupdated: playerSchema,
	message: z.string(),
};
export type ServerAction = keyof typeof ServerActions;
export type ServerActionData<T extends ServerAction> = z.infer<
	(typeof ServerActions)[T]
>;
