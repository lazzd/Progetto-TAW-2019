import { Component, OnInit } from '@angular/core';
import { Table } from 'src/app/classes/table';

import { CashierTablesService } from '../../../../services/User/Cashier/cashier-tables/cashier-tables.service';
import { SocketService } from '../../../../services/socket/socket.service';

import { Router } from "@angular/router";

@Component({
  selector: 'app-cashier-tables',
  templateUrl: './cashier-tables.component.html',
  styleUrls: ['./cashier-tables.component.scss']
})
export class CashierTablesComponent implements OnInit {

  view_tables: Boolean;
  allTables: Table[];

  constructor(
    private cashierTablesService: CashierTablesService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.allTables = [];
    this.view_tables = false;
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

}
