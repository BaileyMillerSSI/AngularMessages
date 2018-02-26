import { Component } from '@angular/core';
import { SocketService } from './_services/socket-service';

import { User, Message, ChatMessage, Action, Event, Configuration } from '../../../Server/src/model/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{

  user: User;
  messages: Message[] = [];
  messageContent: string;
  ioConnection: any;

  constructor(private socketService: SocketService)
  {
    this.initIoConnection();
  }

  private initIoConnection(): void
  {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) =>
      {
        console.log(`Message: ${message.content}`);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() =>
      {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() =>
      {
        console.log('disconnected');
      });
  }

  public SendMessage(): void
  { 
    this.socketService.send(new ChatMessage(new User("Bailey"), "Testing!"));
  }
}
