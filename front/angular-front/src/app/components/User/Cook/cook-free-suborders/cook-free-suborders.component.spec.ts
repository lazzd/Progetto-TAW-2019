import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookFreeSubordersComponent } from './cook-free-suborders.component';

describe('CookFreeSubordersComponent', () => {
  let component: CookFreeSubordersComponent;
  let fixture: ComponentFixture<CookFreeSubordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookFreeSubordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookFreeSubordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
