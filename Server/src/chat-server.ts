import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message } from './model/message';
import { Event, Action } from "./model/enums";
import { Configuration } from "./model/config";

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

    private listen(): void
    {

        this.server.listen(this.port, () =>
        {
            console.log('Running server on port %s', this.port);
        });
    
        this.io.on(Event.CONNECT, (socket: any) =>
        {
            console.log('Connected client on port %s.', this.port);

            socket.on('message', (m: Message) =>
            {
                //console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('action', (a: Action) =>
            {
                this.io.emit('action', a);
            });

            socket.on(Event.DISCONNECT, () =>
            {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application
    {
        return this.app;
    }
}