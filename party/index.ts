import type * as Party from 'partykit/server';

export default class Server implements Party.Server {
	constructor(readonly party: Party.Party) {}

	static onBeforeConnect(req: Party.Request, lobby: Party.Lobby) {
		console.log('onBeforeConnect: lobby: ', lobby.id);
	}

	onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// A websocket just connected!
		console.log(
			`Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
		);

		// let's send a message to the connection
		conn.send(JSON.stringify({ message: 'hello from server' }));
	}

	onMessage(message: string, sender: Party.Connection) {
		// let's log the message
		console.log(`connection ${sender.id} sent message: ${message}`);
		// as well as broadcast it to all the other connections in the room...
		// this.party.broadcast(
		// 	`${sender.id}: ${message}`,
		// 	// ...except for the connection it came from
		// 	[sender.id]
		// );
		this.party.broadcast(message);
	}
}

Server satisfies Party.Worker;
