import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyJoinedCurrentuserComponent } from './party-joined-currentuser.component';

describe('PartyJoinedCurrentuserComponent', () => {
  let component: PartyJoinedCurrentuserComponent;
  let fixture: ComponentFixture<PartyJoinedCurrentuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyJoinedCurrentuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyJoinedCurrentuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
