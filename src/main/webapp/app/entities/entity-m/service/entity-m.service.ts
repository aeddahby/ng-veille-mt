import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEntityM, getEntityMIdentifier } from '../entity-m.model';

export type EntityResponseType = HttpResponse<IEntityM>;
export type EntityArrayResponseType = HttpResponse<IEntityM[]>;

@Injectable({ providedIn: 'root' })
export class EntityMService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/entity-ms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(entityM: IEntityM): Observable<EntityResponseType> {
    return this.http.post<IEntityM>(this.resourceUrl, entityM, { observe: 'response' });
  }

  update(entityM: IEntityM): Observable<EntityResponseType> {
    return this.http.put<IEntityM>(`${this.resourceUrl}/${getEntityMIdentifier(entityM) as number}`, entityM, { observe: 'response' });
  }

  partialUpdate(entityM: IEntityM): Observable<EntityResponseType> {
    return this.http.patch<IEntityM>(`${this.resourceUrl}/${getEntityMIdentifier(entityM) as number}`, entityM, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEntityM>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEntityM[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEntityMToCollectionIfMissing(entityMCollection: IEntityM[], ...entityMSToCheck: (IEntityM | null | undefined)[]): IEntityM[] {
    const entityMS: IEntityM[] = entityMSToCheck.filter(isPresent);
    if (entityMS.length > 0) {
      const entityMCollectionIdentifiers = entityMCollection.map(entityMItem => getEntityMIdentifier(entityMItem)!);
      const entityMSToAdd = entityMS.filter(entityMItem => {
        const entityMIdentifier = getEntityMIdentifier(entityMItem);
        if (entityMIdentifier == null || entityMCollectionIdentifiers.includes(entityMIdentifier)) {
          return false;
        }
        entityMCollectionIdentifiers.push(entityMIdentifier);
        return true;
      });
      return [...entityMSToAdd, ...entityMCollection];
    }
    return entityMCollection;
  }
}
