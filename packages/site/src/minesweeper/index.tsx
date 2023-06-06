import Board from './Board';
import Menu from './Menu';
import { createStore } from 'solid-js/store';
import { generateBoard, generateEmptyBoard, type Cell } from './lib/board';
import { createEffect } from 'solid-js';

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

export default function Minesweeper() {
	const [state, setState] = createStore({
		difficulty: 'easy' as Difficulty,
		board: [] as Cell[][],
		boardIsEmpty: true,
		gameOver: false,
		gameWon: false,
	});

	createEffect(() => {
		setState('board', generateEmptyBoard(difficulties[state.difficulty]));
		setState('boardIsEmpty', true);
	});

	const markCell = (cell: Cell, x: number, y: number) => {
		if (cell.isRevealed) return;
		setState('board', x, y, { isFlagged: !cell.isFlagged });
	};

	const getNearbyCells = (x: number, y: number) => {
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
	};

	const revealSurroundingCellsIfCorrectNumberMarked = (
		cell: Cell,
		x: number,
		y: number
	) => {
		if (!cell.isRevealed || cell.nearbyMines === 0) return;
		const nearbyCells = getNearbyCells(x, y);
		const nearbyFlags = nearbyCells.filter((cell) => cell.isFlagged);
		if (nearbyFlags.length !== cell.nearbyMines) return;
		nearbyCells.forEach((cell) => {
			if (!cell.isFlagged) revealCell(cell, cell.x, cell.y);
		});
	};

	const revealCell = (cell: Cell, x: number, y: number) => {
		if (state.boardIsEmpty) {
			setState(
				'board',
				generateBoard({
					...difficulties[state.difficulty],
					startPoint: [x, y],
				})
			);
			setState('boardIsEmpty', false);
		}

		if (cell.isRevealed) {
			revealSurroundingCellsIfCorrectNumberMarked(cell, x, y);
			return;
		}
		setState('board', x, y, { isRevealed: true });

		if (cell.hasMine) {
			alert('Game over!');
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
					revealCell(cell, x + i, y + j);
				}
			}
		}
	};

	const setDifficulty = (difficulty: Difficulty) => {
		setState('difficulty', difficulty);
	};

	return (
		<div>
			<h1>Minesweeper</h1>
			<Menu setDifficulty={setDifficulty} />
			<p>{state.difficulty}</p>
			<Board
				settings={difficulties[state.difficulty]}
				board={state.board}
				revealCell={revealCell}
				markCell={markCell}
			/>
		</div>
	);
}
