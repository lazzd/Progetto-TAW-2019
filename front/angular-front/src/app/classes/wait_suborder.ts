import { ElementOrder } from './element_order';
import { ElementMenu } from './element_menu';

export class WaitSuborder{
    table: string;
    id_order: number;
    id_suborder: number;
    waiter: string;
    suborder: ElementMenu[];
    constructor(table: string, id_order: number, id_suborder: number, waiter: string, suborder: ElementMenu[]){
        this.table = table;
        this.id_order = id_order;
        this.id_suborder = id_suborder;
        this.waiter = waiter;
        this.suborder = [];
        suborder.forEach(elem => this.suborder.push(new ElementMenu(elem)));
    }
}