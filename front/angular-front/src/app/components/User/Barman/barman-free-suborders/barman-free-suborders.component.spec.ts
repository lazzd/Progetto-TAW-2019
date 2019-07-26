import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarmanFreeSubordersComponent } from './barman-free-suborders.component';

describe('BarmanFreeSubordersComponent', () => {
  let component: BarmanFreeSubordersComponent;
  let fixture: ComponentFixture<BarmanFreeSubordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarmanFreeSubordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarmanFreeSubordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
