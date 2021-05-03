import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate12Component } from './ntemplate12.component';

describe('Ntemplate12Component', () => {
  let component: Ntemplate12Component;
  let fixture: ComponentFixture<Ntemplate12Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate12Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
