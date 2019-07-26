import { ElementMenu } from './element_menu';

export class Order{
    drinks_order?: ElementMenu[];
    foods_order?: ElementMenu[];
    table?: string;
    waiter?: string;
    constructor(drinks_order: ElementMenu[], foods_order:ElementMenu[], table?: string, waiter?: string){
        if(drinks_order && drinks_order.length>0)
            this.drinks_order = drinks_order;
        if(foods_order && foods_order.length>0)
            this.foods_order = foods_order
        if(table){
            this.table = table;
        }
        if(waiter)
            this.waiter = waiter;
    }
}