import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesControllerComponent } from './ques-controller.component';

describe('QuesControllerComponent', () => {
  let component: QuesControllerComponent;
  let fixture: ComponentFixture<QuesControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuesControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuesControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
