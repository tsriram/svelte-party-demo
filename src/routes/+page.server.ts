import type { PageServerLoad } from './$types';
import { PUBLIC_PARTYKIT_HOST, PUBLIC_PARTYKIT_ROOM } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
	const host = PUBLIC_PARTYKIT_HOST;
	const room = PUBLIC_PARTYKIT_ROOM;
	const response = await fetch(`${host}/party/${room}`);
	const data = await response.json();
	return {
		count: data?.count || 0
	};
};
