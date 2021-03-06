import { Component, OnInit } from '@angular/core';

import { CashierStatisticsService } from '../../../../services/User/Cashier/cashier-statistics/cashier-statistics.service';
import { SocketService } from '../../../../services/socket/socket.service';
import { Router } from "@angular/router";
import { User } from 'src/app/classes/user';


@Component({
  selector: 'app-cashier-statistics',
  templateUrl: './cashier-statistics.component.html',
  styleUrls: ['./cashier-statistics.component.scss']
})
export class CashierStatisticsComponent implements OnInit {

  view_users: Boolean;
  allUsers: User[];

  //dati per i vari chart
  pieChartLabelsWaiter: string[];
  pieChartDataWaiter: number[];

  pieChartLabelsBarman: string[];
  pieChartDataBarman: number[];

  pieChartLabelsChef: string[];
  pieChartDataChef: number[];

  pieChartLabelsCashier: string[];
  pieChartDataCashier: number[];

  private options: any = {
    legend: { position: 'bottom' }
  }

  pieChartType = 'pie';

  constructor(
    private cashierStatisticsService: CashierStatisticsService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {

    this.initIoConnection();
    this.view_users = false;
    this.allUsers = [];
    this.getAllUsers();

    this.pieChartLabelsWaiter = [];
    this.pieChartDataWaiter = [];

    this.pieChartLabelsBarman = [];
    this.pieChartDataBarman = [];

    this.pieChartLabelsChef = [];
    this.pieChartDataChef = [];

    this.pieChartLabelsCashier = [];
    this.pieChartDataCashier = [];
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .newAction()
      .subscribe(user => {
        console.log("A NEW USER ACTION", user);
        const indexPresent = this.allUsers.findIndex(elem => elem.email == user.email);
        // User già pushato e presente nel pie chart, ricerca per nomi univoci (i nomi sono univoci per db)
        if (indexPresent != -1) {
          this.allUsers[indexPresent] = new User(user);
          if (user.task === 'waiter') {
            const indexPie = this.pieChartLabelsWaiter.findIndex(elem => elem == user.name);
            if (indexPie != -1)
              this.pieChartDataWaiter[indexPie] = user.actions;
          }
          else if (user.task === 'barman') {
            const indexPie = this.pieChartLabelsBarman.findIndex(elem => elem == user.name);
            if (indexPie != -1)
              this.pieChartDataBarman[indexPie] = user.actions;
          }
          else if (user.task === 'cook') {
            const indexPie = this.pieChartLabelsChef.findIndex(elem => elem == user.name);
            if (indexPie != -1)
              this.pieChartDataChef[indexPie] = user.actions;
          }
          else if (user.task === 'cashier') {
            const indexPie = this.pieChartLabelsCashier.findIndex(elem => elem == user.name);
            if (indexPie != -1)
              this.pieChartDataCashier[indexPie] = user.actions;
          }
        }
        else {
          this.allUsers.push(new User(user));
          if (user.task === 'waiter') { this.pieChartLabelsWaiter.push(user.name); this.pieChartDataWaiter.push(user.actions); }
          else if (user.task === 'barman') { this.pieChartLabelsBarman.push(user.name); this.pieChartDataBarman.push(user.actions); }
          else if (user.task === 'cook') { this.pieChartLabelsChef.push(user.name); this.pieChartDataChef.push(user.actions); }
          else if (user.task === 'cashier') { this.pieChartLabelsCashier.push(user.name); this.pieChartDataCashier.push(user.actions); }
          if (this.allUsers.length > 0)
            this.view_users = true;
        }
      });
  }

  async getAllUsers(): Promise<void> {
    try {
      let CashierStatisticsServicePromise = await this.cashierStatisticsService.getAllUsers();
      // ritorna l'observable
      CashierStatisticsServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            console.log("ResSub Length == 0");
          }
          else {
            console.log(ResSub);
            ResSub.forEach(element => {
              this.allUsers.push(new User(element));
            });
            if (this.allUsers.length > 0) {
              this.view_users = true;
              for (let us of this.allUsers) {
                if (us.task === 'waiter') { this.pieChartLabelsWaiter.push(us.name); this.pieChartDataWaiter.push(us.actions); }
                else if (us.task === 'barman') { this.pieChartLabelsBarman.push(us.name); this.pieChartDataBarman.push(us.actions); }
                else if (us.task === 'cook') { this.pieChartLabelsChef.push(us.name); this.pieChartDataChef.push(us.actions); }
                else if (us.task === 'cashier') { this.pieChartLabelsCashier.push(us.name); this.pieChartDataCashier.push(us.actions); }
              }
            }
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
      console.log("SEND ORDER err", errorPromise);
    }
  }

}
