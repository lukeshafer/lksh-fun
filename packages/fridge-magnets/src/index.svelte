<script lang="ts">
	export let apiUrl: string;

	import './main.css';
	import { connect } from './websockets/main';
	//import MainMenu from './windows/MainMenu.svelte';
	// import 'normalize.css';
	const shuffleBackgroundColor = () => {
		const randomColor = Math.floor(Math.random() * 0xffffff);
		// set the --body-background variable to the random color
		document.documentElement.style.setProperty(
			'--body-background',
			`#${randomColor.toString(16)}`
		);
	};

	async function testConnect() {
		console.log(name);
		const connection = await connect(apiUrl, () => {
			console.log('connected');
		});

		connection.send('sendmessage', 'Hello from the client');

		setTimeout(() => {
			connection.disconnect();
		}, 10000);
	}

	let name = '';
</script>

<button class="btn" on:click={shuffleBackgroundColor}><span>✨</span></button>
<input type="text" id="name" bind:value={name} placeholder="Your Name" required />
<button class="btn" on:click={testConnect}><span>Connect</span></button>

<style>
	span {
		--color: #666;
		text-shadow: 1px 1px 0px var(--color), -1px -1px 0px var(--color);
		/* text-shadow: 1px 1px 0px black, -1px -1px 0px black, 0 0 15px var(--color), 0 0 5px var(--color), */
		/* 0 0 25px var(--color), 0 0 25px var(--color), 0 0 25px var(--color), 0 0 25px var(--color); */
	}
</style>
