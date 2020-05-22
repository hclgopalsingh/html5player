import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Template08V2Component } from './template08-v2.component';

describe('Template08V2Component', () => {
  let component: Template08V2Component;
  let fixture: ComponentFixture<Template08V2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Template08V2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Template08V2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
