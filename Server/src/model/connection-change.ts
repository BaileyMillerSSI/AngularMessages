import { Action } from "./enums";
import { User } from "./user";

export class ConnectionChange
{ 
    constructor(public Action: Action, public User: User){}
}