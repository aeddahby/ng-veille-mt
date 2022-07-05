import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EntityMDetailComponent } from './entity-m-detail.component';

describe('EntityM Management Detail Component', () => {
  let comp: EntityMDetailComponent;
  let fixture: ComponentFixture<EntityMDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityMDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ entityM: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EntityMDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EntityMDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load entityM on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.entityM).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
