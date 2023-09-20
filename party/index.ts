import type * as Party from 'partykit/server';

const json = (response: string) =>
	new Response(response, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

export default class Server implements Party.Server {
	constructor(readonly party: Party.Party) {}
	count: number = 0;

	async onStart() {
		// load count from storage on startup
		this.count = (await this.party.storage.get<number>('count')) ?? 0;
	}

	async onRequest(req: Party.Request) {
		// for all HTTP requests, respond with the current count
		return json(JSON.stringify({ count: this.count }));
	}

	async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// A websocket just connected!
		console.log(
			`Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
		);
		conn.send(JSON.stringify({ count: this.count }));
	}

	async onMessage(message: string, sender: Party.Connection) {
		const data = message && JSON.parse(message);
		if (data && data.count) {
			this.count = data.count;
			await this.party.storage.put('count', this.count);
			this.party.broadcast(JSON.stringify({ count: this.count }), [sender.id]);
		}
	}
}

Server satisfies Party.Worker;
