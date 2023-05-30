import './main.css';
import { GameClient } from './game-client';
import { createSignal, onMount } from 'solid-js';
//import { css } from '@acab/ecsstatic';

export default function(props: { apiUrl: string }) {
	const [name, setName] = createSignal('');
	const [connected, setConnected] = createSignal(false);
	let client: GameClient;

	onMount(() => {
		client = new GameClient(props.apiUrl);
		client.connect().then(() => setConnected(true));

		window.addEventListener('beforeunload', () => {
			client.disconnect();
		});
	});

	return (
		<article>
			<input
				type="text"
				id="name"
				value={name()}
				onInput={(e) => setName(e.target.value)}
				placeholder="Your Name"
				required
			/>
			<button
				class="btn"
				onClick={() => client.ping(name())}
				classList={{ visible: !connected() }}>
				<span>Connect</span>
			</button>
		</article>
	);
}
