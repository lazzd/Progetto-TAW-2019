import { Component, OnInit, ɵɵresolveBody } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';

import { WaiterTablesService } from '../../../../services/User/Waiter/waiter-tables/waiter-tables.service';

// for routing
import { Router } from "@angular/router";

import { Table } from 'src/app/classes/table';
import { State } from 'src/app/classes/state';

@Component({
  selector: 'app-waiter-tables',
  templateUrl: './waiter-tables.component.html',
  styleUrls: ['./waiter-tables.component.scss']
})
export class WaiterTablesComponent implements OnInit {

  form_table: FormGroup;

  view_tables: Boolean;

  selectTable: string;

  lastSubmit: number;

  getTables: Table[];

  constructor(
    private waiterTablesService: WaiterTablesService,
    private router: Router) { }

  ngOnInit() {
    this.form_table = new FormGroup({
      num_seats: new FormControl()
    })
    this.view_tables = false;
    this.lastSubmit = 0;
    this.getTables = [];
  }

  async getTablesBySeats(): Promise<void> {
    try {
      const seats = this.form_table.value.num_seats;
      if (seats) {
        let WaiterTablesServicePromise = await this.waiterTablesService.getTablesBySeats(seats);
        // ritorna l'observable...
        WaiterTablesServicePromise.subscribe(
          (ResSub => {
            // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
            this.selectTable = "";
            this.confirmedTable = "";
            this.getTables = [];
            if (ResSub.length == 0) {
              this.view_tables = false;
            }
            else {
              console.log(ResSub);
              ResSub.forEach(element => {
                this.getTables.push(new Table(element));
              });
              console.log(this.getTables);

              //sorto i tavoli, così se ne ho tanti avrò sempre prima quelli più vicini al numero richiesto, per evitare di cercare la soluzione migliore tra centinaia di tavoli

              this.getTables.sort(function (a, b) {
                return a.seats - b.seats;
              });

              this.view_tables = true;
            }
          }),
          (ErrSub => {
            // necessario il catch della promise non gestisce l'errore dell'observable
            // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
            this.router.navigate(['/auth/login']);
            // da andare in pagina di login
            console.log("SEND ORDER err", ErrSub);
          })
        )
      }
      else {
        this.selectTable = "";
        this.getTables = [];
        this.view_tables = false;
      }

    } catch (errorPromise) {
      this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

  async pairTable(): Promise<void> {
    try {
      let WaiterTablesServicePromise = await this.waiterTablesService.pairTable(this.selectTable, new State(true, localStorage.getItem('UserName')));
      // ritorna l'observable...
      WaiterTablesServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          // metti messaggio di buona riuscita
          console.log("SEND STATE RES", ResSub);
          this.selectTable = "";
          this.view_tables = false;
          console.log(this.confirmedTable);

        }),
        (ErrSub => {
          // necessario il catch della promise non gestisce l'errore dell'observable
          // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
          //this.router.navigate(['/auth/login']);
          // da andare in pagina di login
          console.log("SEND ORDER err", ErrSub);
        })
      )
    } catch (errorPromise) {
      //this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

  async final(): Promise<void> {
    await this.pairTable();
    await this.getTablesBySeats();
  }

}