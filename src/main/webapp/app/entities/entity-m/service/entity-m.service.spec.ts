import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEntityM, EntityM } from '../entity-m.model';

import { EntityMService } from './entity-m.service';

describe('EntityM Service', () => {
  let service: EntityMService;
  let httpMock: HttpTestingController;
  let elemDefault: IEntityM;
  let expectedResult: IEntityM | IEntityM[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EntityMService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a EntityM', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EntityM()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EntityM', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EntityM', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
        },
        new EntityM()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EntityM', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a EntityM', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEntityMToCollectionIfMissing', () => {
      it('should add a EntityM to an empty array', () => {
        const entityM: IEntityM = { id: 123 };
        expectedResult = service.addEntityMToCollectionIfMissing([], entityM);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entityM);
      });

      it('should not add a EntityM to an array that contains it', () => {
        const entityM: IEntityM = { id: 123 };
        const entityMCollection: IEntityM[] = [
          {
            ...entityM,
          },
          { id: 456 },
        ];
        expectedResult = service.addEntityMToCollectionIfMissing(entityMCollection, entityM);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EntityM to an array that doesn't contain it", () => {
        const entityM: IEntityM = { id: 123 };
        const entityMCollection: IEntityM[] = [{ id: 456 }];
        expectedResult = service.addEntityMToCollectionIfMissing(entityMCollection, entityM);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entityM);
      });

      it('should add only unique EntityM to an array', () => {
        const entityMArray: IEntityM[] = [{ id: 123 }, { id: 456 }, { id: 89051 }];
        const entityMCollection: IEntityM[] = [{ id: 123 }];
        expectedResult = service.addEntityMToCollectionIfMissing(entityMCollection, ...entityMArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const entityM: IEntityM = { id: 123 };
        const entityM2: IEntityM = { id: 456 };
        expectedResult = service.addEntityMToCollectionIfMissing([], entityM, entityM2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entityM);
        expect(expectedResult).toContain(entityM2);
      });

      it('should accept null and undefined values', () => {
        const entityM: IEntityM = { id: 123 };
        expectedResult = service.addEntityMToCollectionIfMissing([], null, entityM, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entityM);
      });

      it('should return initial array if no EntityM is added', () => {
        const entityMCollection: IEntityM[] = [{ id: 123 }];
        expectedResult = service.addEntityMToCollectionIfMissing(entityMCollection, undefined, null);
        expect(expectedResult).toEqual(entityMCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
