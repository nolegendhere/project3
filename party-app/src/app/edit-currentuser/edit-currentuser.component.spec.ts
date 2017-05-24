import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurrentuserComponent } from './edit-currentuser.component';

describe('EditCurrentuserComponent', () => {
  let component: EditCurrentuserComponent;
  let fixture: ComponentFixture<EditCurrentuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCurrentuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCurrentuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
