import { TestBed } from '@angular/core/testing';

import { InflationService } from './inflation.service';

describe('InflationService', () => {
  let service: InflationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InflationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
