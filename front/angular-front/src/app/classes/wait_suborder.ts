import { ElementOrder } from './element_order';
import { ElementMenu } from './element_menu';
import { StateElementOrder } from './state_element_order';

export class WaitSuborder {
    table: string;
    id_order: number;
    id_suborder: number;
    waiter: string;
    state: StateElementOrder;
    suborder?: ElementMenu[];
    drinks_order?: ElementMenu[];
    foods_order?: ElementMenu[];
    constructor(table: string, id_order: number, id_suborder: number, waiter: string, state: StateElementOrder, suborder?: ElementMenu[]) {
        this.table = table;
        this.id_order = id_order;
        this.id_suborder = id_suborder;
        this.waiter = waiter;
        this.state = new StateElementOrder(state);
        if (suborder) {
            this.suborder = [];
            suborder.forEach(elem => this.suborder.push(new ElementMenu(elem)));
        }
    }
    setDrinksOrder(drinks_order: ElementMenu[]) {
        this.drinks_order = [];
        drinks_order.forEach(elem => this.drinks_order.push(new ElementMenu(elem)));
    }
    setFoodsOrder(foods_order: ElementMenu[]) {
        this.foods_order = [];
        foods_order.forEach(elem => this.foods_order.push(new ElementMenu(elem)));
    }
}