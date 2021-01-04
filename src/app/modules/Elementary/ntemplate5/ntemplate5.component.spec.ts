import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate5Component } from './ntemplate5.component';

describe('Ntemplate5Component', () => {
  let component: Ntemplate5Component;
  let fixture: ComponentFixture<Ntemplate5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
