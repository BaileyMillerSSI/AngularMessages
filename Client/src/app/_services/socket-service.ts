import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { User, Message, ChatMessage, Action, Event, Configuration } from '../../../../Server/src/model/index';

import * as socketIo from 'socket.io-client';

const SERVER_URL = `${Configuration.URL}:${Configuration.PORT}`;

@Injectable()
export class SocketService
{
    private socket;

    public initSocket(): void
    {
        this.socket = socketIo(SERVER_URL);
    }

    public send(message: Message): void
    {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<Message>
    {
        return new Observable<Message>(observer =>
        {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any>
    {
        return new Observable<Event>(observer =>
        {
            this.socket.on(event, () => observer.next());
        });
    }
}