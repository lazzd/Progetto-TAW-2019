import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierReceiptsComponent } from './cashier-receipts.component';

describe('CashierReceiptsComponent', () => {
  let component: CashierReceiptsComponent;
  let fixture: ComponentFixture<CashierReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
