import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatuserComponent } from './chatuser.component';

describe('ChatuserComponent', () => {
  let component: ChatuserComponent;
  let fixture: ComponentFixture<ChatuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
