import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate11Component } from './ntemplate11.component';

describe('Ntemplate11Component', () => {
  let component: Ntemplate11Component;
  let fixture: ComponentFixture<Ntemplate11Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate11Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
