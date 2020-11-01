import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularCheckboxComponent } from './circular-checkbox.component';

describe('CircularCheckboxComponent', () => {
  let component: CircularCheckboxComponent;
  let fixture: ComponentFixture<CircularCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircularCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
