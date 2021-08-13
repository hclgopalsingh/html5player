import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Template11Componenteva } from './template11.component';

describe('Template11Component', () => {
  let component: Template11Componenteva;
  let fixture: ComponentFixture<Template11Componenteva>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Template11Componenteva ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Template11Componenteva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
