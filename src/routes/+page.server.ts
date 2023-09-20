import type { PageServerLoad } from './$types';
import { PUBLIC_PARTYKIT_HOST, PUBLIC_PARTYKIT_ROOM } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
	const host = PUBLIC_PARTYKIT_HOST;
	const room = PUBLIC_PARTYKIT_ROOM;
	const partykitUrl = `${host}/party/${room}`;
	console.log('partykitUrl: ', partykitUrl);
	const response = await fetch(partykitUrl);
	const data = await response.json();
	return {
		count: data?.count || 0
	};
};
