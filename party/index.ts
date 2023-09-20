import type * as Party from 'partykit/server';

export default class Server implements Party.Server {
	constructor(readonly party: Party.Party) {}

	static onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {
		console.log('onBeforeConnect: lobby: ', lobby.id);
	}

	async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// A websocket just connected!
		console.log(
			`Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
		);
		const storedData = await this.party.storage.get<string>('counter');
		const data = storedData && JSON.parse(storedData);
		if (data && data.count) {
			conn.send(storedData);
			console.log('storedData: ', storedData);
		} else {
			console.log('no stored data');
		}
	}

	async onMessage(message: string, sender: Party.Connection) {
		// let's log the message
		console.log(`connection ${sender.id} sent message: ${message}`);
		// as well as broadcast it to all the other connections in the room...
		// this.party.broadcast(
		// 	`${sender.id}: ${message}`,
		// 	// ...except for the connection it came from
		// 	[sender.id]
		// );
		const data = message && JSON.parse(message);
		if (data && data.count) {
			await this.party.storage.put('counter', message);
		}
		this.party.broadcast(message, [sender.id]);
	}
}

Server satisfies Party.Worker;
