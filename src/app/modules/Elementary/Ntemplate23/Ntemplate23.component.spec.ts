import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate23Component } from './Ntemplate23.component';

describe('Ntemplate23Component', () => {
  let component: Ntemplate23Component;
  let fixture: ComponentFixture<Ntemplate23Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate23Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate23Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
