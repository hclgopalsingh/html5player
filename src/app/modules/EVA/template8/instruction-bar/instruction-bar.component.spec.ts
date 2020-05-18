import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionBarComponent } from './instruction-bar.component';

describe('InstructionBarComponent', () => {
  let component: InstructionBarComponent;
  let fixture: ComponentFixture<InstructionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
