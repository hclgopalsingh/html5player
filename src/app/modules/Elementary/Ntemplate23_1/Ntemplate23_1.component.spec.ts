import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate23_1Component } from './Ntemplate23_1.component';

describe('Ntemplate23Component', () => {
  let component: Ntemplate23_1Component;
  let fixture: ComponentFixture<Ntemplate23_1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate23_1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate23_1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
