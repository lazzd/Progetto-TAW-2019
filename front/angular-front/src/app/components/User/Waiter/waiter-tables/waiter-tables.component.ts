import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-waiter-tables',
  templateUrl: './waiter-tables.component.html',
  styleUrls: ['./waiter-tables.component.scss']
})
export class WaiterTablesComponent implements OnInit {

  form_table: FormGroup;

  constructor() {
    this.form_table = new FormGroup({
      num_seats: new FormControl()
    })
  }

  ngOnInit() {
    this.form_table = new FormGroup({
      num_seats: new FormControl()
    })
  }

  onSubmit(): void {
    if (this.form_table.value.num_seats)
      console.log(this.form_table.value.num_seats);  // {first: 'Nancy', last: 'Drew'}
  }

}
