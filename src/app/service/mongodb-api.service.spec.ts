import { TestBed } from '@angular/core/testing';

import { MongodbApiService } from './mongodb-api.service';

describe('MongodbApiService', () => {
  let service: MongodbApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongodbApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
