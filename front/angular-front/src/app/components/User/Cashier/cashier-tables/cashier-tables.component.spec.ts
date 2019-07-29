import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierTablesComponent } from './cashier-tables.component';

describe('CashierTablesComponent', () => {
  let component: CashierTablesComponent;
  let fixture: ComponentFixture<CashierTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
