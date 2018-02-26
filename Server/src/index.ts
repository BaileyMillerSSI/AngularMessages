import { ChatServer } from './chat-server';

import { User } from "./model/user";
import { Message } from "./model/message";
import { ChatMessage } from "./model/chat-message";

let app = new ChatServer().getApp();
export { app, User };