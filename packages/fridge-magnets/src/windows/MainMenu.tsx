import { state } from "@/state";
import { onMount } from "solid-js";

export default function MainMenu() {
	return <div class="page-wrapper">
		<h1 class="title"><span>Fridge</span> <span>Magnets</span></h1>
		<div class="buttons" style:visibility={$client ? 'visible' : 'hidden'}>
			<div method="post" class="form create">
				<input
					type="text"
					class="piece"
					id="name"
					bind:value={name}
					placeholder="Your Name"
					required />
				<button on:click={createRoom} class="btn">Create Room</button>
			</div>
			<div class="form">
				<input type="text" bind:value={name} hidden aria-hidden="true" required />
				<input
					type="text"
					class="piece"
					id="roomID"
					bind:value={roomID}
					placeholder="Room Code"
					required />
				<button on:click={joinRoom} class="btn">Join Room</button>
				<!-- <a href="/room/{roomID}" class="btn" disabled={roomID?.length < 4}>Join Room</a> -->
				<p class="error">{errorText}</p>
			</div>
			{#key isSessionValid}
			{#if oldSessionID && isSessionValid}
			<button on:click={tryRejoining} class="btn">Re-join disconnected game</button>
			{/if}
		{/key}
	</div>
	</div>
}
