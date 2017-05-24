import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyListCurrentuserComponent } from './party-list-currentuser.component';

describe('PartyListCurrentuserComponent', () => {
  let component: PartyListCurrentuserComponent;
  let fixture: ComponentFixture<PartyListCurrentuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyListCurrentuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyListCurrentuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
