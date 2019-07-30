import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierStatisticsComponent } from './cashier-statistics.component';

describe('CashierStatisticsComponent', () => {
  let component: CashierStatisticsComponent;
  let fixture: ComponentFixture<CashierStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
