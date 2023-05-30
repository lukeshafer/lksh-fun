import { z } from 'zod';

export type Piece = z.infer<typeof pieceSchema>;
export const pieceSchema = z.object({
	word: z.string(),
	id: z.number(),
	x: z.number(),
	y: z.number(),
});

export type Player = z.infer<typeof playerSchema>;
export const playerSchema = z.object({
	name: z.string(),
	hand: z.array(pieceSchema),
	isVIP: z.boolean(),
	status: z.enum(['editing', 'waiting', 'finished']),
	submission: z.array(pieceSchema),
	connected: z.boolean(),
});
export type PlayerStatus = Player['status'];

export type PromptCard = z.infer<typeof promptCardSchema>;
export const promptCardSchema = z.object({
	prompt: z.string(),
	id: z.number(),
});

export type Room = z.infer<typeof roomSchema>;
export const roomSchema = z.object({
	roomId: z.string(),
	gamePhase: z.enum(['lobby', 'playing', 'showcase', 'resetting']),
	turn: z.number(),
	players: z.record(playerSchema),
	currentPrompt: promptCardSchema,
	showcaseID: z.string(),
});
