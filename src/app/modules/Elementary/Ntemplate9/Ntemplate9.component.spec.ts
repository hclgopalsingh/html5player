import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate9Component } from './ntemplate9.component';

describe('Ntemplate9Component', () => {
  let component: Ntemplate9Component;
  let fixture: ComponentFixture<Ntemplate9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
