export class Table {
    name_table: string;
    seats: number;
    busy: boolean;
    waiter?: string;
    constructor(table: Table) {
        this.name_table = table.name_table;
        this.seats = table.seats;
        this.busy = table.busy;
        if (table.waiter)
            this.waiter = table.waiter;
    }
}