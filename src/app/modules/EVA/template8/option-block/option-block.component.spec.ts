import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionBlockComponent } from './option-block.component';

describe('OptionBlockComponent', () => {
  let component: OptionBlockComponent;
  let fixture: ComponentFixture<OptionBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
