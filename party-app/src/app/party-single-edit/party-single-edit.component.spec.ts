import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySingleEditComponent } from './party-single-edit.component';

describe('PartySingleEditComponent', () => {
  let component: PartySingleEditComponent;
  let fixture: ComponentFixture<PartySingleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartySingleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartySingleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
