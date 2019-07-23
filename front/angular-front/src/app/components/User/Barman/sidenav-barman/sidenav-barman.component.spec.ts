import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavBarmanComponent } from './sidenav-barman.component';

describe('SidenavBarmanComponent', () => {
  let component: SidenavBarmanComponent;
  let fixture: ComponentFixture<SidenavBarmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavBarmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavBarmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
