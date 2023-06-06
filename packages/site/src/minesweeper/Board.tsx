import { Index } from 'solid-js';
import type { BoardSettings } from '.';
import type { Cell as CellProps } from './lib/board';
import Cell from './Cell';
import { css } from '@acab/ecsstatic';

export default function Board(props: {
	settings: BoardSettings;
	board: CellProps[][];
	revealCell: (cell: CellProps, x: number, y: number) => void;
	markCell: (cell: CellProps, x: number, y: number) => void;
}) {
	return (
		<div>
			<Index each={props.board}>
				{(row, x) => (
					<div class={rowStyles}>
						<Index each={row()}>
							{(cell, y) => (
								<Cell
									{...cell()}
									reveal={() =>
										props.revealCell(cell(), x, y)
									}
									mark={() => props.markCell(cell(), x, y)}
								/>
							)}
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
