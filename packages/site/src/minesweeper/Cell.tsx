import { css } from '@acab/ecsstatic';
import type { Cell as CellProps } from './lib/board';

export default function Cell(
	props: CellProps & {
		reveal: () => void;
		mark: () => void;
	}
) {
	const reveal = () => {
		if (props.isFlagged) return;
		props.reveal();
	};

	const mark = (e: MouseEvent) => {
		e.preventDefault();
		if (props.isRevealed) return;
		props.mark();
	};

	return (
		<button
			class={base}
			classList={{ [revealed]: props.isRevealed }}
			onclick={reveal}
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
	display: flex;
	justify-content: center;
	align-items: center;

	border-radius: 0px;
`;

const revealed = css`
	background-color: #fff;
`;
