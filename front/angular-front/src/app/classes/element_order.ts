import { StateElementOrder } from './state_element_order';
import { StateEmployeesElementOrder } from './state_employees_element_order';
import { ElementMenu } from './element_menu';

export class ElementOrder{
    state: StateElementOrder;
    employees: StateEmployeesElementOrder;
    drinks_order: ElementMenu[];
    foods_order: ElementMenu[];
    id_suborder: number;
    tot_sub: number;
    constructor(elementOrder: ElementOrder){
        this.state = new StateElementOrder(elementOrder.state);
        this.employees = new StateEmployeesElementOrder(elementOrder.employees);

        this.drinks_order = [];
        elementOrder.drinks_order.forEach((elem) => this.drinks_order.push(new ElementMenu(elem)));

        this.foods_order = [];
        elementOrder.foods_order.forEach((elem) => this.foods_order.push(new ElementMenu(elem)));

        this.id_suborder = elementOrder.id_suborder;
        this.tot_sub = elementOrder.tot_sub;
    }
}