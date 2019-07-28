export class StateOrder{
    complete: Boolean;
    all_served: Boolean;
    all_drinks_complete: Boolean;
    all_foods_complete: Boolean;
    constructor(stateOrder: StateOrder){
        this.complete = stateOrder.complete;
        this.all_served = stateOrder.all_served;
        this.all_drinks_complete = stateOrder.all_drinks_complete;
        this.all_foods_complete = stateOrder.all_foods_complete;
    }
}