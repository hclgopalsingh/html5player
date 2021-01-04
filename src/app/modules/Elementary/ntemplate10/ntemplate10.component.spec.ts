import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate10Component } from './ntemplate10.component';

describe('Ntemplate10Component', () => {
  let component: Ntemplate10Component;
  let fixture: ComponentFixture<Ntemplate10Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate10Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
