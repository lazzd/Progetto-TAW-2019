import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierOrdersComponent } from './cashier-orders.component';

describe('CashierOrdersComponent', () => {
  let component: CashierOrdersComponent;
  let fixture: ComponentFixture<CashierOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
