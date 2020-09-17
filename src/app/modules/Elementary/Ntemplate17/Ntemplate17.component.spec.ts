import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate17Component } from './ntemplate17.component';

describe('Ntemplate17Component', () => {
  let component: Ntemplate17Component;
  let fixture: ComponentFixture<Ntemplate17Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate17Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
