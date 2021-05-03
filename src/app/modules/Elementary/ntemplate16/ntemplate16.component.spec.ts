import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate16Component } from './ntemplate16.component';

describe('Ntemplate16Component', () => {
  let component: Ntemplate16Component;
  let fixture: ComponentFixture<Ntemplate16Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate16Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
