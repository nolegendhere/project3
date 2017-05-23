import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCurrentuserComponent } from './show-currentuser.component';

describe('ShowCurrentuserComponent', () => {
  let component: ShowCurrentuserComponent;
  let fixture: ComponentFixture<ShowCurrentuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCurrentuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCurrentuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
