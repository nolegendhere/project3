import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPartyJoinedCurrentuserComponent } from './show-party-joined-currentuser.component';

describe('ShowPartyJoinedCurrentuserComponent', () => {
  let component: ShowPartyJoinedCurrentuserComponent;
  let fixture: ComponentFixture<ShowPartyJoinedCurrentuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPartyJoinedCurrentuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPartyJoinedCurrentuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
