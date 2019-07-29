import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavCashierComponent } from './sidenav-cashier.component';

describe('SidenavCashierComponent', () => {
  let component: SidenavCashierComponent;
  let fixture: ComponentFixture<SidenavCashierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavCashierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
