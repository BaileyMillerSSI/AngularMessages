import { Component } from '@angular/core';
import { SocketService } from './_services/socket-service';

import { User, Message, ChatMessage, Action, Event, Configuration, ConnectionChange } from '../../../Server/src/model/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{

  user: User;
  messages: ChatMessage[] = [];
  messageContent: string;
  ioConnection: any;

  constructor(private socketService: SocketService)
  {
    this.initIoConnection();
  }

  private initIoConnection(): void
  {
    this.socketService.initSocket(new User("Bailey"));

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: ChatMessage) =>
      {
        this.messages.push(message);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() =>
      {
        console.log('connected');
      });
    
    this.socketService.onConnectionNotification().subscribe((status: ConnectionChange) =>
    {
      console.log(`User: ${status.User.name} has ${status.Action}`);
    });
  }

  public SendMessage(): void
  { 
    this.socketService.send("Testing!");
  }

  public BySentAt(): Message[]
  { 
    return this.messages.sort((a: ChatMessage, b: ChatMessage) =>
    {
      if (a.sentAt < b.sentAt)
      {
        return 1;
      } else if (a.sentAt > b.sentAt)
      {
        return -1;
      } else
      { 
        return 0;
      }  
    });
  }
}
