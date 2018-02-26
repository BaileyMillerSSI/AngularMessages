export enum Action
{
    JOINED = 'joined',
    LEFT = 'left',
    CONNECTED = 'connected',
    RENAME = 'renamed'
}

// Socket.io events
export enum Event
{
    CONNECT = 'connect',
    DISCONNECT = 'disconnect'
}