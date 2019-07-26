import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarmanMySubordersComponent } from './barman-my-suborders.component';

describe('BarmanMySubordersComponent', () => {
  let component: BarmanMySubordersComponent;
  let fixture: ComponentFixture<BarmanMySubordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarmanMySubordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarmanMySubordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
