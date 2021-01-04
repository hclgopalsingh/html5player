import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate8Component } from './ntemplate8.component';

describe('NTemplate8Component', () => {
  let component: NTemplate8Component;
  let fixture: ComponentFixture<NTemplate8Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
