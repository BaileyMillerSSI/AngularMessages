import { Injectable, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { User, Message, ChatMessage, Action, Event, Configuration, ConnectionChange, NameChange } from '../../../../Server/src/model/index';

import * as socketIo from 'socket.io-client';

const SERVER_URL = `${Configuration.URL}:${Configuration.PORT}`;

@Injectable()
export class SocketService
{
    private socket;
    private _User: User;
    public isInit: boolean = false;

    public initSocket(u: User): void
    {
        this.socket = socketIo(SERVER_URL);
        this.socket.emit(Action.JOINED, u);
        this._User = u;
        this.isInit = true;

        // Register for page exit event!
        window.onbeforeunload = () =>
        {
            this.socket.emit(Action.LEFT, this._User)
        };
    }

    public send(s: string): void
    {
        this.socket.emit('message', new ChatMessage(this._User, s, new Date()));
    }

    public GetUsername(): string
    { 
        return this._User.name;
    }

    public changeName(u: User): void
    { 
        this.socket.emit(Action.RENAME, this._User, u);
        this._User = u;
    }

    public onMessage(): Observable<ChatMessage>
    {
        return new Observable<ChatMessage>(observer =>
        {
            this.socket.on('message', (data: ChatMessage) => observer.next(data));
        });
    }

    public onConnectionNotification(): Observable<ConnectionChange>
    { 
        return new Observable<ConnectionChange>(observer =>
        {
            this.socket.on(Action.CONNECTED, (data: ConnectionChange) => observer.next(data));
        });
    }

    public onRenamed(): Observable<NameChange>
    { 
        return new Observable<NameChange>(observer =>
        {
            this.socket.on(Action.RENAME, (data: NameChange) => observer.next(data));
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