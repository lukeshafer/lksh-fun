import Board from './Board';
import Menu from './Menu';
import { state, setState } from './lib/state';
import type { Cell, Difficulty } from './lib/board';
import { createEffect, onMount } from 'solid-js';

export default function Minesweeper() {
	createEffect(() => {
		state.reset();
	});

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === ' ') {
				e.preventDefault();
				const currentCell = state.currentCell;
				if (!currentCell) return;
				if (currentCell.isRevealed) {
					state.revealSurroundingCellsIfCorrectNumberMarked(
						currentCell,
						state.currentCellX,
						state.currentCellY
					);
					return;
				}
				state.markCell(
					currentCell,
					state.currentCellX,
					state.currentCellY
				);
			}
		});
	});

	const setDifficulty = (difficulty: Difficulty) => {
		setState('difficulty', difficulty);
	};

	return (
		<div>
			<h1>Minesweeper</h1>
			<Menu setDifficulty={setDifficulty} />
			<p>{state.difficulty}</p>
			<Board
				board={state.board}
				revealCell={state.revealCell}
				markCell={state.markCell}
				revealSurrounding={
					state.revealSurroundingCellsIfCorrectNumberMarked
				}
				setCurrentCell={(cell: Cell, x: number, y: number) => {
					if (state.gameOver || state.gameWon) return;
					if (state.currentCell === cell) return;
					setState('currentCell', cell);
					setState('currentCellX', x);
					setState('currentCellY', y);
				}}
			/>
		</div>
	);
}
