import './main.css';
import { GameClient } from './game-client';
import { createSignal, onMount } from 'solid-js';
import { state, setState } from './state';
import MainMenu from './windows/MainMenu';
//import { css } from '@acab/ecsstatic';

export default function (props: { apiUrl: string }) {
	const [client, setClient] = createSignal<GameClient>();

	onMount(() => {
		setClient(
			new GameClient(props.apiUrl, {
				onclose: () => {
					setState('isConnected', false);
				},
			})
		);
		client()!
			.connect()
			.then(() => setState('isConnected', true));

		window.addEventListener('beforeunload', () => {
			client()?.disconnect();
		});
	});

	return (
		<p>
			{client() ? (
				!state.room ? (
					<MainMenu client={client()!} />
				) : state.room.gamePhase === 'lobby' ? (
					<p>Lobby (not implemented)</p>
				) : state.room.gamePhase === 'playing' ? (
					<p>Playing (not implemented)</p>
				) : state.room.gamePhase === 'showcase' ? (
					<p>Showcase (not implemented)</p>
				) : null
			) : null}
		</p>
	);
}
