import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManipulateImagesComponent } from './manipulate-images.component';

describe('ManipulateImagesComponent', () => {
  let component: ManipulateImagesComponent;
  let fixture: ComponentFixture<ManipulateImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManipulateImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManipulateImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
