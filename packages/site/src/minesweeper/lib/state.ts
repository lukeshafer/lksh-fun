import { createStore } from 'solid-js/store';
import { generateBoard, generateEmptyBoard, type Difficulty } from './board';
import type { Cell } from './cell';

export type StateSetter = typeof setState;
export type State = typeof state;

export const [state, setState] = createStore({
	difficulty: 'easy' as Difficulty,
	board: [] as Cell[][],
	boardIsEmpty: true,
	gameOver: false,
	gameWon: false,
	currentCell: null as Cell | null,
	currentCellX: 0,
	currentCellY: 0,
	reset: () => {
		setState('board', generateEmptyBoard(state));
		setState('boardIsEmpty', true);
		setState('gameOver', false);
		setState('gameWon', false);
	},
	firstClick: (x: number, y: number) => {
		setState('board', generateBoard({ state, startPoint: [x, y] }));
		setState('boardIsEmpty', false);
	},
	triggerGameOver: () => {
		setState('gameOver', true);
	},
	setCurrentCell: (cell: Cell) => {
		setState('currentCell', cell);
	},

	markCell: (cell: Cell, x: number, y: number) => {
		if (cell.isRevealed) return;
		setState('board', x, y, { isFlagged: !cell.isFlagged });
	},
	getNearbyCells: (x: number, y: number) => {
		const cells = [];
		for (let i = -1; i <= 1; i++) {
			if (x + i < 0 || x + i >= state.board.length) continue;
			for (let j = -1; j <= 1; j++) {
				const row = state.board[x + i];
				if (!row) continue;
				if (y + j < 0 || y + j >= row.length) continue;
				if (i === 0 && j === 0) continue;
				const cell = state.board[x + i]?.[y + j];
				if (!cell) continue;
				cells.push({
					...cell,
					x: x + i,
					y: y + j,
				});
			}
		}
		return cells;
	},
	revealSurroundingCellsIfCorrectNumberMarked: (
		cell: Cell,
		x: number,
		y: number
	) => {
		if (!cell.isRevealed || cell.nearbyMines === 0) return;
		const nearbyCells = state.getNearbyCells(x, y);
		const nearbyFlags = nearbyCells.filter((cell) => cell.isFlagged);
		if (nearbyFlags.length !== cell.nearbyMines) {
			return;
		}
		nearbyCells.forEach((cell) => {
			if (!cell.isFlagged && !cell.isRevealed)
				state.revealCell(cell, cell.x, cell.y);
		});
	},
	revealCell: (cell: Cell, x: number, y: number) => {
		if (state.boardIsEmpty) {
			setState('board', generateBoard({ state, startPoint: [x, y] }));
			setState('boardIsEmpty', false);
		}

		setState('board', x, y, { isRevealed: true });

		if (cell.hasMine) {
			setState('gameOver', true);
			return;
		}

		if (cell.nearbyMines === 0) {
			// reveal all adjacent cells
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (x + i < 0 || x + i >= state.board.length) continue;
					if (y + j < 0 || y + j >= state.board[x]!.length) continue;
					if (i === 0 && j === 0) continue;

					const cell = state.board[x + i]?.[y + j];
					if (!cell || cell.isRevealed) continue;
					state.revealCell(cell, x + i, y + j);
				}
			}
		}
	},
});
