export class StateElementOrder{
    drinks_complete: Boolean;
    foods_complete: Boolean;
    constructor(stateElementOrder: StateElementOrder){
        this.drinks_complete = stateElementOrder.drinks_complete;
        this.foods_complete = stateElementOrder.foods_complete;
    }
}