import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEntityM, EntityM } from '../entity-m.model';
import { EntityMService } from '../service/entity-m.service';

@Injectable({ providedIn: 'root' })
export class EntityMRoutingResolveService implements Resolve<IEntityM> {
  constructor(protected service: EntityMService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEntityM> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((entityM: HttpResponse<EntityM>) => {
          if (entityM.body) {
            return of(entityM.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EntityM());
  }
}
