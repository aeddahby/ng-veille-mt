import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DirectionRegionaleService } from '../service/direction-regionale.service';
import { IDirectionRegionale, DirectionRegionale } from '../direction-regionale.model';

import { DirectionRegionaleUpdateComponent } from './direction-regionale-update.component';

describe('DirectionRegionale Management Update Component', () => {
  let comp: DirectionRegionaleUpdateComponent;
  let fixture: ComponentFixture<DirectionRegionaleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let directionRegionaleService: DirectionRegionaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DirectionRegionaleUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DirectionRegionaleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DirectionRegionaleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    directionRegionaleService = TestBed.inject(DirectionRegionaleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const directionRegionale: IDirectionRegionale = { id: 456 };

      activatedRoute.data = of({ directionRegionale });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(directionRegionale));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DirectionRegionale>>();
      const directionRegionale = { id: 123 };
      jest.spyOn(directionRegionaleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ directionRegionale });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: directionRegionale }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(directionRegionaleService.update).toHaveBeenCalledWith(directionRegionale);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DirectionRegionale>>();
      const directionRegionale = new DirectionRegionale();
      jest.spyOn(directionRegionaleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ directionRegionale });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: directionRegionale }));
      saveSubject.complete();

      // THEN
      expect(directionRegionaleService.create).toHaveBeenCalledWith(directionRegionale);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DirectionRegionale>>();
      const directionRegionale = { id: 123 };
      jest.spyOn(directionRegionaleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ directionRegionale });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(directionRegionaleService.update).toHaveBeenCalledWith(directionRegionale);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
