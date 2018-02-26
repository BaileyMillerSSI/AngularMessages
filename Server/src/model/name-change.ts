import { User } from "./user";

export class NameChange
{ 
    constructor(public oldUser: User, public newUser: User) { }
}