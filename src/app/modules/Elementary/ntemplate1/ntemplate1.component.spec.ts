import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate1Component } from './ntemplate1.component';

describe('Ntemplate1Component', () => {
  let component: Ntemplate1Component;
  let fixture: ComponentFixture<Ntemplate1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
