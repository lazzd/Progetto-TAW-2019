export class StateElementOrder{
    served: Boolean;
    drinks_complete: Boolean;
    foods_complete: Boolean;
    constructor(stateElementOrder: StateElementOrder){
        this.served = stateElementOrder.served;
        this.drinks_complete = stateElementOrder.drinks_complete;
        this.foods_complete = stateElementOrder.foods_complete;
    }
}