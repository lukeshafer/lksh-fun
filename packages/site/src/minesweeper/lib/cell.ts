import { createStore } from 'solid-js/store';
import type { State } from './state';

interface CellProps {
	hasMine: boolean;
	isRevealed: boolean;
	isFlagged: boolean;
	nearbyMines: number;
	row: number;
	col: number;
}

export type Cell = ReturnType<typeof createCell>;

export function createCell(opts: {
	hasMine: boolean;
	row: number;
	col: number;
	state: State;
}) {
	const values = {
		hasMine: opts.hasMine,
		isRevealed: false,
		isFlagged: false,
		nearbyMines: 0,
		row: opts.row,
		col: opts.col,
	} as CellProps;

	const [cell, setCell] = createStore({
		...values,
		mark: () => {
			if (cell.isRevealed) return;
			setCell('isFlagged', !cell.isFlagged);
		},
		reveal: () => {
			if (opts.state.boardIsEmpty)
				opts.state.firstClick(opts.row, opts.col);

			setCell('isRevealed', true);

			if (cell.hasMine) {
				opts.state.triggerGameOver();
				return;
			}

			if (cell.nearbyMines === 0) {
				// reveal all adjacent cells
				for (let i = -1; i <= 1; i++) {
					for (let j = -1; j <= 1; j++) {
						if (
							opts.col + i < 0 ||
							opts.col + i >= opts.state.board.length
						)
							continue;
						if (
							opts.row + j < 0 ||
							opts.row + j >= opts.state.board[opts.col]!.length
						)
							continue;
						if (i === 0 && j === 0) continue;

						const cell =
							opts.state.board[opts.col + i]?.[opts.row + j];
						if (!cell || cell.isRevealed) continue;
						opts.state.revealCell(cell, opts.col + i, opts.row + j);
					}
				}
			}
		},
		getNeighbors: () => {
			const cells = [];
			for (let i = -1; i <= 1; i++) {
				if (opts.col + i < 0 || opts.col + i >= opts.state.board.length)
					continue;
				for (let j = -1; j <= 1; j++) {
					const row = opts.state.board[opts.col + i];
					if (!row) continue;
					if (opts.row + j < 0 || opts.row + j >= row.length)
						continue;
					if (i === 0 && j === 0) continue;
					const cell = opts.state.board[opts.col + i]?.[opts.row + j];
					if (!cell) continue;
					cells.push({
						...cell,
						row: opts.col + i,
						col: opts.row + j,
					});
				}
			}
			return cells;
		},
		revealSurrounding: () => {
			if (!cell.isRevealed || cell.nearbyMines === 0) return;
			const nearbyCells = cell.getNeighbors();
			const nearbyFlags = nearbyCells.filter((cell) => cell.isFlagged);
			if (nearbyFlags.length !== cell.nearbyMines) {
				return;
			}
			nearbyCells.forEach((cell) => {
				if (!cell.isFlagged && !cell.isRevealed) cell.reveal();
			});
		},
		setNearbyMines(value: number) {
			setCell('nearbyMines', value);
		},
		setCurrentCell() {
			opts.state.setCurrentCell(cell);
		},
	});

	return cell;
}
