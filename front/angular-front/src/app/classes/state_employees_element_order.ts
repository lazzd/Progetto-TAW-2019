export class StateEmployeesElementOrder{
    drinks_employee: string;
    foods_employee: string;
    constructor(employees: StateEmployeesElementOrder){
        this.drinks_employee = employees.drinks_employee;
        this.foods_employee = employees.foods_employee;
    }
}