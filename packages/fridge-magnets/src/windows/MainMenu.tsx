import { state } from '../state';
import { onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { GameClient } from '../game-client';
import { css } from '@acab/ecsstatic';

export default function MainMenu(props: { client: GameClient }) {
	const [menuState, setMenuState] = createStore({
		name: '',
		oldRoomId: '',
		oldSessionId: '',
		oldSessionExpiration: 0,
		isSessionValid: false,
		roomId: '',
		errorText: '',
	});

	onMount(() => {
		setMenuState({
			name: sessionStorage.getItem('name') || '',
			oldRoomId: localStorage.getItem('roomID') || '',
			oldSessionId: localStorage.getItem('sessionID') || '',
			oldSessionExpiration: parseInt(localStorage.getItem('sessionExpiration') || '0'),
			isSessionValid: false,
		});
		if (menuState.oldSessionExpiration < Date.now()) {
			localStorage.removeItem('sessionID');
			localStorage.removeItem('sessionExpiration');
			setMenuState('isSessionValid', false);
			setMenuState('oldSessionId', '');
		}
	});

	const checkIfSessionActive = () => {
		if (menuState.oldSessionExpiration < Date.now()) {
			localStorage.removeItem('sessionID');
			localStorage.removeItem('sessionExpiration');
			setMenuState('isSessionValid', false);
		} else {
			setMenuState('isSessionValid', true);
			setTimeout(checkIfSessionActive, 2000);
		}
	};

	if (menuState.oldSessionId) checkIfSessionActive();

	return (
		<div class={pageWrapper}>
			<h1 class={`title ${h1}`}>
				<span>Fridge</span> <span>Magnets</span>
			</h1>
			<div class={buttons} style={{ visibility: state.isConnected ? 'visible' : 'hidden' }}>
				<form
					class={`${form} ${formCreate}`}
					onsubmit={async (e) => {
						e.preventDefault();
						await props.client.createRoom({ name: menuState.name });
					}}>
					<input
						type="text"
						class={`piece ${input}`}
						id="name"
						onchange={(e) => (menuState.name = e.target.value)}
						value={menuState.name}
						placeholder="Your Name"
						required
					/>
					<button class={btn}>Create Room</button>
				</form>
				<form
					class={`${form}`}
					onsubmit={async (e) => {
						e.preventDefault();
						await props.client.joinRoom({
							roomId: menuState.roomId,
							name: menuState.name,
						});
					}}>
					<input
						class={input}
						type="text"
						value={menuState.name}
						hidden
						aria-hidden="true"
						required
					/>
					<input
						type="text"
						class={`piece ${input} ${roomId}`}
						id="roomID"
						onchange={(e) => (menuState.roomId = e.target.value)}
						value={menuState.roomId || ''}
						placeholder="Room Code"
						required
					/>
					<button class={btn}>Join Room</button>
					<p class={error}>{menuState.errorText}</p>
				</form>
				{menuState.oldSessionId && menuState.isSessionValid && menuState.oldRoomId ? (
					<form
						class={form}
						onsubmit={async (e) => {
							e.preventDefault();
							await props.client.tryRejoiningRoom(menuState.oldRoomId);
						}}>
						<button class={btn}>Re-join disconnected game</button>
					</form>
				) : null}
			</div>
			<a
				href="https://docs.google.com/forms/d/e/1FAIpQLSdlhgBV4yFDX9EOCz3MMpT3OC3TL-ArnXbp8F8i0xm76k9OuA/viewform?usp=sf_link"
				target="_blank"
				class={btn}>
				Suggest <br />a prompt!
			</a>
		</div>
	);
}

const pageWrapper = css`
	margin: 2rem 0;
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	align-items: center;
	min-height: 62vh;
	gap: 2rem;

	grid-template-columns: repeat(auto-fit, min(30rem, 80vw));
	grid-template-rows: auto;
	place-items: center;
`;

const form = css`
	display: flex;
	gap: 1rem;
	align-items: center;
	justify-content: center;
`;

const formCreate = css`
	flex-direction: column;
`;

const h1 = css`
	margin: 0;
`;

const input = css`
	width: min(10rem, 100%);
	text-align: center;
`;

const roomId = css`
	width: 8.5rem;
	text-transform: uppercase;
`;

const buttons = css`
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: center;
	text-align: left;
	gap: 3rem;
	max-width: 90vw;
	padding: 0.5rem;
`;

const error = css`
	color: #ff0000;
	font-size: 12px;
`;

const btn = css`
	width: fit-content;
`;
