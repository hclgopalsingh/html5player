import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate20Component } from './Ntemplate20.component';

describe('Ntemplate20Component', () => {
  let component: Ntemplate20Component;
  let fixture: ComponentFixture<Ntemplate20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
