import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBarmanComponent } from './user-barman.component';

describe('UserBarmanComponent', () => {
  let component: UserBarmanComponent;
  let fixture: ComponentFixture<UserBarmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBarmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBarmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
