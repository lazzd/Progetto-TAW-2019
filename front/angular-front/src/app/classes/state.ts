export class State{
    state: boolean;
    waiter?: string;
    type?: string;
    constructor(state: boolean, waiter?: string, type?: string){
        this.state = state;
        if(waiter)
            this.waiter = waiter;
        if(type)
            this.type = type;
    }
}