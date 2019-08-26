import { StateOrder } from './state_order';
import { ElementOrder } from './element_order';

export class ResOrder{
    state_order: StateOrder;
    table: string;
    waiter: string;
    elements_order: ElementOrder[];
    date: Date;
    num_suborders: number;
    id_order: number;
    tot: number;
    constructor(order: ResOrder){
        this.state_order = new StateOrder(order.state_order);
        this.table = order.table;
        this.waiter = order.waiter;

        this.elements_order = [];
        order.elements_order.forEach((elem) => this.elements_order.push(new ElementOrder(elem)));
        
        this.date = order.date;
        this.num_suborders = order.num_suborders;
        this.id_order = order.id_order;
        this.tot = order.tot;
    }
}