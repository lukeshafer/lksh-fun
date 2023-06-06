import type { BoardSettings } from '@/minesweeper';

export interface Cell {
	hasMine: boolean;
	isRevealed: boolean;
	isFlagged: boolean;
	nearbyMines: number;
	row: number;
	col: number;
}

export function generateEmptyBoard(opts: BoardSettings) {
	const board = [] as Cell[][];
	for (let i = 0; i < opts.height; i++) {
		for (let j = 0; j < opts.width; j++) {
			board[i] = board[i] || [];
			board[i]![j] = {
				hasMine: false,
				isRevealed: false,
				isFlagged: false,
				nearbyMines: 0,
				row: j,
				col: i,
			};
		}
	}
	return board;
}

export function generateBoard(
	opts: BoardSettings & {
		startPoint: [number, number];
	}
) {
	const board = [] as Cell[][];
	let mines = opts.mines;

	const minePositions = [] as [number, number][];
	while (mines > 0) {
		const x = Math.floor(Math.random() * opts.width);
		const y = Math.floor(Math.random() * opts.height);

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

	for (let i = 0; i < opts.height; i++) {
		for (let j = 0; j < opts.width; j++) {
			const hasMine = minePositions.some(
				([mx, my]) => mx === j && my === i
			);
			board[i] = board[i] || [];
			board[i]![j] = {
				hasMine,
				isRevealed: false,
				isFlagged: false,
				nearbyMines: 0,
				row: j,
				col: i,
			};
		}
	}

	// Calculate nearby mines
	for (let i = 0; i < opts.height; i++) {
		for (let j = 0; j < opts.width; j++) {
			const cell = board[i]![j]!;
			if (cell.hasMine) continue;

			let nearbyMines = 0;
			for (let y = i - 1; y <= i + 1; y++) {
				for (let x = j - 1; x <= j + 1; x++) {
					if (y < 0 || y >= opts.height) continue;
					if (x < 0 || x >= opts.width) continue;
					if (y === i && x === j) continue;

					const nearbyCell = board[y]![x]!;
					if (nearbyCell.hasMine) nearbyMines++;
				}
			}

			cell.nearbyMines = nearbyMines;
			board[i]![j] = cell;
		}
	}

	return board;
}
