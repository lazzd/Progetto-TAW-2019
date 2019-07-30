export class User {
    name: string;
    email: string;
    actions: number;
    date: Date;
    task: string;
    constructor(user: User) {
        this.name = user.name;
        this.email = user.email;
        this.actions = user.actions;
        this.date = user.date;
        this.task = user.task;
    }
}