import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate14Component } from './Ntemplate14.component';

describe('Ntemplate14Component', () => {
  let component: Ntemplate14Component;
  let fixture: ComponentFixture<Ntemplate14Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate14Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
