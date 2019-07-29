import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierBillComponent } from './cashier-bill.component';

describe('CashierBillComponent', () => {
  let component: CashierBillComponent;
  let fixture: ComponentFixture<CashierBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
