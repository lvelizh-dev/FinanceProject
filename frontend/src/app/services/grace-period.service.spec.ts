import { TestBed } from '@angular/core/testing';

import { GracePeriodService } from './grace-period.service';

describe('GracePeriodService', () => {
  let service: GracePeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GracePeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
