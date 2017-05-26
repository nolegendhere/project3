import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartyCurrentuserComponent } from './new-party-currentuser.component';

describe('NewPartyCurrentuserComponent', () => {
  let component: NewPartyCurrentuserComponent;
  let fixture: ComponentFixture<NewPartyCurrentuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPartyCurrentuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPartyCurrentuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
