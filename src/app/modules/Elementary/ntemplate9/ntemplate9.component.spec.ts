import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate9Component } from './ntemplate9.component';

describe('NTemplate9Component', () => {
  let component: NTemplate9Component;
  let fixture: ComponentFixture<NTemplate9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
