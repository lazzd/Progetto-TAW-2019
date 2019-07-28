export class StateElementOrder{
    drinks_served: Boolean;
    foods_served: Boolean;
    drinks_complete: Boolean;
    foods_complete: Boolean;
    constructor(stateElementOrder: StateElementOrder){
        this.drinks_served = stateElementOrder.drinks_served;
        this.foods_served = stateElementOrder.foods_served;
        this.drinks_complete = stateElementOrder.drinks_complete;
        this.foods_complete = stateElementOrder.foods_complete;
    }
}