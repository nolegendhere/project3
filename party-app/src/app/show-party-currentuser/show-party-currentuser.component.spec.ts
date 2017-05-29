import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPartyCurrentuserComponent } from './show-party-currentuser.component';

describe('ShowPartyCurrentuserComponent', () => {
  let component: ShowPartyCurrentuserComponent;
  let fixture: ComponentFixture<ShowPartyCurrentuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPartyCurrentuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPartyCurrentuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
