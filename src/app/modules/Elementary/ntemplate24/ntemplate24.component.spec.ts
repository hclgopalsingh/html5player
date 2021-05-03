import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate24Component } from './ntemplate24.component';

describe('Ntemplate24Component', () => {
  let component: Ntemplate24Component;
  let fixture: ComponentFixture<Ntemplate24Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate24Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate24Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
