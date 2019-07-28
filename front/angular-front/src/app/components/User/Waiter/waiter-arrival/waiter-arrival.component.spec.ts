import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterArrivalComponent } from './waiter-arrival.component';

describe('WaiterArrivalComponent', () => {
  let component: WaiterArrivalComponent;
  let fixture: ComponentFixture<WaiterArrivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterArrivalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
