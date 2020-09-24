import { TestBed } from '@angular/core/testing';

import { ApilinkService } from './apilink.service';

describe('ApilinkService', () => {
  let service: ApilinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApilinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
