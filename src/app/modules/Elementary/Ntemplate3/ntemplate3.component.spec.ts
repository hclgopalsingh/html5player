import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate3Component } from './ntemplate3.component';

describe('Ntemplate3Component', () => {
  let component: Ntemplate3Component;
  let fixture: ComponentFixture<Ntemplate3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
