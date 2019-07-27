import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavCookComponent } from './sidenav-cook.component';

describe('SidenavCookComponent', () => {
  let component: SidenavCookComponent;
  let fixture: ComponentFixture<SidenavCookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavCookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavCookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
