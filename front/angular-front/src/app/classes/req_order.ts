import { ElementMenu } from './element_menu';

// RequestOrder : con ? sia per POST che per PUT

export class ReqOrder {
    drinks_order?: ElementMenu[];
    foods_order?: ElementMenu[];
    table?: string;
    waiter?: string;
    // tot_suborder to update the total of order
    tot_sub: number;
    constructor(drinks_order: ElementMenu[], foods_order: ElementMenu[], tot_sub: number, table?: string, waiter?: string) {
        if (drinks_order && drinks_order.length > 0) {
            //this.drinks_order = drinks_order;
            this.drinks_order = [];
            drinks_order.forEach((elem) => this.drinks_order.push(new ElementMenu(elem)));
        }
        if (foods_order && foods_order.length > 0) {
            //this.foods_order = foods_order;
            this.foods_order = [];
            foods_order.forEach((elem) => this.foods_order.push(new ElementMenu(elem)));
        }
        this.tot_sub = tot_sub;
        if (table) {
            this.table = table;
        }
        if (waiter)
            this.waiter = waiter;
    }
}