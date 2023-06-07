import { css } from '@acab/ecsstatic';
import type { Cell as CellProps } from './lib/cell';

export default function Cell(props: CellProps) {
	const reveal = () => {
		if (props.isFlagged) return;
		props.reveal();
	};

	const mark = (e: MouseEvent) => {
		e.preventDefault();
		if (props.isRevealed) return;
		props.mark();
	};

	const revealSurrounding = (e: MouseEvent) => {
		if (!props.isRevealed) return;
		if (e.button !== 0) return;
		props.revealSurrounding();
	};

	const setCurrentCell = () => {
		props.setCurrentCell();
	};

	return (
		<button
			class={base}
			classList={{ [revealed]: props.isRevealed }}
			onclick={reveal}
			ondblclick={revealSurrounding}
			onmouseover={setCurrentCell}
			oncontextmenu={mark}>
			{props.isRevealed
				? props.hasMine
					? '💣'
					: props.nearbyMines || ''
				: props.isFlagged
				? '🚩'
				: null}
		</button>
	);
}

const base = css`
	width: 30px;
	height: 30px;
	background-color: #ccc;
	border: 1px solid #999;
	color: #000;
	font-family: monospace;
	font-size: 20px;
	font-weight: bold;
	display: flex;
	justify-content: center;
	align-items: center;

	border-radius: 0px;
`;

const revealed = css`
	background-color: #fff;
`;
