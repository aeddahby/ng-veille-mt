import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import dayjs, { Dayjs } from 'dayjs/esm';
import { map, Observable } from 'rxjs';
import { IStatistic } from '../statistic.model';

export type EntityArrayResponseType = HttpResponse<IStatistic[]>;

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/statistics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  byCategories(startDate: Dayjs, finishDate: Dayjs): Observable<EntityArrayResponseType> {
    return this.http
      .get<IStatistic[]>(`${this.resourceUrl}/pertinenceByCategory/${startDate}/${finishDate}`, { observe: 'response' })
      .pipe(map(result => result));
  }

  byDirection(): Observable<EntityArrayResponseType> {
    return this.http.get<IStatistic[]>(this.resourceUrl + '/pertinenceByDirection', { observe: 'response' }).pipe(map(result => result));
  }

  byContributor(): Observable<EntityArrayResponseType> {
    return this.http.get<IStatistic[]>(this.resourceUrl + '/pertinenceByContributor', { observe: 'response' }).pipe(map(result => result));
  }

  volumeByDirection(): Observable<EntityArrayResponseType> {
    return this.http.get<IStatistic[]>(this.resourceUrl + '/volumeByDirection', { observe: 'response' }).pipe(map(result => result));
  }

  volumeByCategory(): Observable<EntityArrayResponseType> {
    return this.http.get<IStatistic[]>(this.resourceUrl + '/volumeByCategory', { observe: 'response' }).pipe(map(result => result));
  }
}
