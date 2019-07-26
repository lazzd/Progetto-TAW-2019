export class Table {
    name_table: string;
    seats: number;
    busy: boolean;
    waiter?: string;
    id_order?: number;
    constructor(table: Table) {
        this.name_table = table.name_table;
        this.seats = table.seats;
        this.busy = table.busy;
        if (table.waiter)
            this.waiter = table.waiter;
        if (table.id_order)
            this.id_order = table.id_order;
    }
}