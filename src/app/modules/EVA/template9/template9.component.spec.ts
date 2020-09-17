import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Template9Component } from './template9.component';

describe('Template9Component', () => {
  let component: Template9Component;
  let fixture: ComponentFixture<Template9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Template9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Template9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
