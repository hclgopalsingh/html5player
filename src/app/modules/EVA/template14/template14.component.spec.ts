import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFourteenComponent } from './template14.component';

describe('Template14Component', () => {
  let component: TemplateFourteenComponent;
  let fixture: ComponentFixture<TemplateFourteenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateFourteenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateFourteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
