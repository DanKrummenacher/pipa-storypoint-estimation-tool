import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationRoom } from './estimation-room';

describe('EstimationRoom', () => {
  let component: EstimationRoom;
  let fixture: ComponentFixture<EstimationRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimationRoom],
    }).compileComponents();

    fixture = TestBed.createComponent(EstimationRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
