export class State{
    state: boolean;
    waiter: string;
    constructor(state: boolean, waiter?: string){
        this.state = state;
        if(waiter)
            this.waiter = waiter;
    }
}