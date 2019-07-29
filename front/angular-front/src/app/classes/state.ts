export class State{
    state: boolean;
    waiter?: string;
    type?: string;
    constructor(state: boolean, waiter?: string){
        this.state = state;
        if(waiter)
            this.waiter = waiter;
    }
    setType(type: string){
        this.type = type;
    }
}