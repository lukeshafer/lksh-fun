import { Index } from 'solid-js';
import type { Cell as CellProps } from './lib/cell';
import Cell from './Cell';
import { css } from '@acab/ecsstatic';

export default function Board(props: {
	board: CellProps[][];
	revealCell: (cell: CellProps, x: number, y: number) => void;
	markCell: (cell: CellProps, x: number, y: number) => void;
	revealSurrounding: (cell: CellProps, x: number, y: number) => void;
	setCurrentCell: (cell: CellProps, x: number, y: number) => void;
}) {
	return (
		<div>
			<Index each={props.board}>
				{(row) => (
					<div class={rowStyles}>
						<Index each={row()}>
							{(cell) => <Cell {...cell()} />}
						</Index>
					</div>
				)}
			</Index>
		</div>
	);
}

const rowStyles = css`
	display: flex;
`;
