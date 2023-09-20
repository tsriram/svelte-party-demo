import type { PageServerLoad } from './$types';
import { PUBLIC_PARTYKIT_HOST, PUBLIC_PARTYKIT_ROOM } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
	const host = PUBLIC_PARTYKIT_HOST;
	const room = PUBLIC_PARTYKIT_ROOM;
	const partykitUrl = `${host}/party/${room}`;
	// fallback count to 0
	let count = 0;
	try {
		const response = await fetch(partykitUrl);
		const data = await response.json();
		if (data && data.count) {
			count = data.count;
		}
	} catch (error) {
		console.error(`Error fetching count from PartyKit: ${error}`);
	}
	return {
		count
	};
};
