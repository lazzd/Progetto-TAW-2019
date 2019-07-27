import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookMySubordersComponent } from './cook-my-suborders.component';

describe('CookMySubordersComponent', () => {
  let component: CookMySubordersComponent;
  let fixture: ComponentFixture<CookMySubordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookMySubordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookMySubordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
