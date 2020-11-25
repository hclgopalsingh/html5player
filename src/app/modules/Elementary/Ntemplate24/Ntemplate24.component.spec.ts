import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate24} from './ntemplate24.component';

describe('Ntemplate24Component', () => {
  let component: Ntemplate24;
  let fixture: ComponentFixture<Ntemplate24>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate24 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate24);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
