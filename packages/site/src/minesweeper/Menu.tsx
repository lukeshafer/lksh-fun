import type { Difficulty } from './lib/board';

export default function Menu(props: {
	setDifficulty: (difficulty: Difficulty) => void;
}) {
	return (
		<menu>
			<button onClick={() => props.setDifficulty('easy')}>Easy</button>
			<button onClick={() => props.setDifficulty('medium')}>
				Medium
			</button>
			<button onClick={() => props.setDifficulty('hard')}>Hard</button>
		</menu>
	);
}
