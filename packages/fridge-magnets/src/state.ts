import { createStore } from 'solid-js/store';
import type { Room, Player } from '@lksh-fun/core/schemas/fridge-magnets';

type pieceObj = {
	word: string;
	position: DOMRect | undefined;
};

export const [state, setState] = createStore<{
	room?: Room;
	player?: Player;
	playedPieces: Record<number, pieceObj>;
	movedCoords: Record<number, { x: number; y: number }>;
	isPlayerDone: boolean;
	gamePhase: 'lobby' | 'playing' | 'waiting';
}>({
	playedPieces: {},
	movedCoords: {},
	isPlayerDone: false,
	gamePhase: 'lobby',
});
