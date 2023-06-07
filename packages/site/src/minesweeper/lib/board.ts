import { createCell, type Cell } from './cell';
import type { State } from './state';

export interface BoardSettings {
	width: number;
	height: number;
	mines: number;
}

export type Difficulty = keyof typeof difficulties;
const difficulties = {
	easy: {
		width: 9,
		height: 9,
		mines: 10,
	},
	medium: {
		width: 16,
		height: 16,
		mines: 40,
	},
	hard: {
		width: 30,
		height: 16,
		mines: 99,
	},
} satisfies Record<string, BoardSettings>;

export function generateEmptyBoard(state: State) {
	const opts = difficulties[state.difficulty];
	const board = [] as Cell[][];
	for (let i = 0; i < opts.height; i++) {
		for (let j = 0; j < opts.width; j++) {
			board[i] = board[i] || [];
			board[i]![j] = createCell({
				hasMine: false,
				row: i,
				col: j,
				state,
			});
		}
	}
	return board;
}

export function generateBoard(opts: {
	state: State;
	startPoint: [number, number];
}) {
	const settings = difficulties[opts.state.difficulty];

	const board = [] as Cell[][];
	let mines = settings.mines;

	const minePositions = [] as [number, number][];
	while (mines > 0) {
		const x = Math.floor(Math.random() * settings.width);
		const y = Math.floor(Math.random() * settings.height);

		const [startY, startX] = opts.startPoint;

		// Don't place mine on start point or on adjacent cells
		if (
			(x === startX && y === startY) ||
			(x >= startX - 1 &&
				x <= startX + 1 &&
				y >= startY - 1 &&
				y <= startY + 1)
		)
			continue;

		if (!minePositions.some(([mx, my]) => mx === x && my === y)) {
			minePositions.push([x, y]);
			mines--;
		}
	}

	for (let i = 0; i < settings.height; i++) {
		for (let j = 0; j < settings.width; j++) {
			const hasMine = minePositions.some(
				([mx, my]) => mx === j && my === i
			);
			board[i] = board[i] || [];
			board[i]![j] = createCell({
				hasMine,
				row: j,
				col: i,
				state: opts.state,
			});
		}
	}

	// Calculate nearby mines
	for (let i = 0; i < settings.height; i++) {
		for (let j = 0; j < settings.width; j++) {
			const cell = board[i]![j]!;
			if (cell.hasMine) continue;

			let nearbyMines = 0;
			for (let y = i - 1; y <= i + 1; y++) {
				for (let x = j - 1; x <= j + 1; x++) {
					if (y < 0 || y >= settings.height) continue;
					if (x < 0 || x >= settings.width) continue;
					if (y === i && x === j) continue;

					const nearbyCell = board[y]![x]!;
					if (nearbyCell.hasMine) nearbyMines++;
				}
			}

			cell.setNearbyMines(nearbyMines);
			board[i]![j] = cell;
		}
	}

	return board;
}
