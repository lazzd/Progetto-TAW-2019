import { Component, OnInit } from '@angular/core';
import { Table } from 'src/app/classes/table';

import { CashierTablesService } from '../../../../services/User/Cashier/cashier-tables/cashier-tables.service';
import { SocketService } from '../../../../services/socket/socket.service';

import { Router } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cashier-tables',
  templateUrl: './cashier-tables.component.html',
  styleUrls: ['./cashier-tables.component.scss']
})
export class CashierTablesComponent implements OnInit {

  view_tables: Boolean;
  allTables: Table[];
  selectedTable: Table;

  view_info_table: Boolean;
  form_my_tables: FormGroup;

  add_table: Boolean;
  form_add_table: FormGroup;

  constructor(
    private cashierTablesService: CashierTablesService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.form_my_tables = new FormGroup({
      my_table: new FormControl()
    });
    this.form_add_table = new FormGroup({
      input_name_table: new FormControl(),
      input_seats: new FormControl()
    })
    this.initIoConnection();
    this.allTables = [];
    this.view_tables = false;
    this.selectedTable = null;
    this.view_info_table = false;
    this.add_table = false;
    this.getAllTables();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .stateTables()
      .subscribe(table => {
        console.log("CHANGE STATE TABLE", table);
        const indexPresent = this.allTables.findIndex(elem => elem.name_table == table.name_table);
        if (indexPresent != -1)
          this.allTables[indexPresent] = new Table(table);
        else {
          console.log("IMPOSSIBLE");
          this.allTables.push(new Table(table));
          if (this.allTables.length > 0)
            this.view_tables = true;
          //this.view_tables = true;
        }
      });
  }

  async getAllTables(): Promise<void> {
    try {
      let CashierTablesServicePromise = await this.cashierTablesService.getAllTables();
      // ritorna l'observable...
      CashierTablesServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            //this.view_tables = false;
          }
          else {
            console.log(ResSub);
            //for(let i=0;i<ResSub.length;++i)
            //this.myTables.push(new Table(ResSub[i]));
            ResSub.forEach(element => {
              this.allTables.push(new Table(element));
            });
            if (this.allTables.length > 0)
              this.view_tables = true;
            //this.view_tables = true;
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
    } catch (errorPromise) {
      this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

  viewInfoTable() {
    (this.view_info_table) ? (this.view_info_table = false) : (this.view_info_table = true);
  }

  getInfoTable() {
    if (this.allTables.length > 0) {
      this.selectedTable = this.allTables.find(elem => elem.name_table == this.form_my_tables.value.my_table);
    }
    console.log(this.selectedTable);
  }

  addTable() {
    (this.add_table) ? (this.add_table = false) : (this.add_table = true);
  }

  async postNewTable() {
    try {
      const newNameTable: string = this.form_add_table.value.input_name_table;
      const newSeats: number = this.form_add_table.value.input_seats;
      if (newNameTable && newSeats) {
        let CashierTablesServicePromise = await this.cashierTablesService.postNewTable(newNameTable, newSeats);
        // ritorna l'observable...
        CashierTablesServicePromise.subscribe(
          (ResSub => {
            // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
            this.allTables.push(new Table(ResSub));
          }),
          (ErrSub => {
            if(ErrSub.error = "Table name is already present")
              console.log("Tavolo già esistente");
            // necessario il catch della promise non gestisce l'errore dell'observable
            // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
            this.router.navigate(['/auth/login']);
            // da andare in pagina di login
            console.log("SEND ORDER err", ErrSub);
          })
        )
      }
    } catch (errorPromise) {
      this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

}
