import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { ChatMessage } from './model/chat-message';
import { Event, Action } from "./model/enums";
import { Configuration } from "./model/config";
import { User } from './model/user';
import { ConnectionChange } from './model/connection-change';

export class ChatServer
{
    public static readonly PORT: number = Configuration.PORT;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor()
    {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void
    {
        this.app = express();
    }

    private createServer(): void
    {
        this.server = createServer(this.app);
    }

    private config(): void
    {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void
    {
        this.io = socketIo(this.server);
    }

    private ConnectionNotification(a: Action.JOINED | Action.LEFT, u: User)
    {
        this.io.emit(Action.CONNECTED, new ConnectionChange(a, u));
    }

    private listen(): void
    {

        this.server.listen(this.port, () =>
        {
            console.log('Running server on port %s', this.port);
        });

        this.io.on(Event.CONNECT, (socket: SocketIO.Socket) =>
        {
            socket.on('message', (m: ChatMessage) =>
            {
                this.io.emit('message', m);
            });

            // Left and joined actions
            socket.on(Action.JOINED, (u: User) =>
            {
                this.io.emit(Action.CONNECTED, new ConnectionChange(Action.JOINED, u));
            });

            socket.on(Action.LEFT, (u: User) =>
            {
                this.io.emit(Action.CONNECTED, new ConnectionChange(Action.LEFT, u));
            });

            socket.on(Action.RENAME, (oldUser: User, newUser: User) =>
            {
                this.io.emit(Action.RENAME, oldUser, newUser);
            });
        });

    }

    public getApp(): express.Application
    {
        return this.app;
    }
}