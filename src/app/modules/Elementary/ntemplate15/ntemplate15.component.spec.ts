import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate15Component } from './ntemplate15.component';

describe('Ntemplate15Component', () => {
  let component: Ntemplate15Component;
  let fixture: ComponentFixture<Ntemplate15Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate15Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
