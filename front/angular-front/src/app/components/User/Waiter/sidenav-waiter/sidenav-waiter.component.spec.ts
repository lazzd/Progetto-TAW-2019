import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavWaiterComponent } from './sidenav-waiter.component';

describe('SidenavWaiterComponent', () => {
  let component: SidenavWaiterComponent;
  let fixture: ComponentFixture<SidenavWaiterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavWaiterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
