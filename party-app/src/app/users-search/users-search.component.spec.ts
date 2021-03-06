import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSearchComponent } from './users-search.component';

describe('UsersSearchComponent', () => {
  let component: UsersSearchComponent;
  let fixture: ComponentFixture<UsersSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
