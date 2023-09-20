<script lang="ts">
	import Counter from './Counter.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	import PartySocket from 'partysocket';
	import { PUBLIC_PARTYKIT_HOST, PUBLIC_PARTYKIT_ROOM } from '$env/static/public';
	let count = data.count || 0;
	let playerCount = data.playerCount || 0;

	const socket = new PartySocket({
		host: PUBLIC_PARTYKIT_HOST,
		room: PUBLIC_PARTYKIT_ROOM
	});

	socket.addEventListener('message', (event) => {
		const data = JSON.parse(event.data);
		if (!isNaN(data?.count)) {
			count = data?.count;
		}
		playerCount = data.playerCount;
	});

	function increment() {
		count += 1;
		socket.send(JSON.stringify({ count }));
	}

	function decrement() {
		count -= 1;
		socket.send(JSON.stringify({ count }));
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome"> SvelteKit + PartyKit Demo = {playerCount} 🎈</span>
	</h1>

	<Counter {count} {increment} {decrement} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}
</style>
