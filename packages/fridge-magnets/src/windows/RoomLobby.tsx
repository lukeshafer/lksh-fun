import type { Room, Player } from '@lksh-fun/core/fridge-magnets/schemas';
import { For, Show, onMount } from 'solid-js';
import type { GameClient } from '../game-client';

export default function RoomLobby(props: {
	room: Room;
	client: GameClient;
	player: Player;
}) {
	onMount(() => {
		sessionStorage.setItem('roomID', props.room.roomId);
	});

	return (
		<div>
			<h1>
				<span>Hello</span> <span>{props.player.name}!</span>
			</h1>
			<ul>
				<h2>Players</h2>
				<Show when={props.room.players}>
					<For each={Object.values(props.room.players)}>
						{(player) => (
							<li
								class="piece"
								style:margin-left="{Math.random() * 100}px">
								<p>{player.name}</p>
								{player.isVIP ? <span>⭐️</span> : null}
							</li>
						)}
					</For>
				</Show>
			</ul>
			<button onClick={() => startGame(props.client, props.room.roomId)}>
				Start game
			</button>
		</div>
	);
}

async function startGame(client: GameClient, roomId: string) {
	console.log('Starting game...');
	client.send('startgame', { roomId });
}
