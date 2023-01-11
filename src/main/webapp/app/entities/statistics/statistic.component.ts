import dayjs from 'dayjs/esm';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { StatisticService } from './service/statistic.service';
import { IStatistic } from './statistic.model';

@Component({
  selector: 'jhi-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit {
  table1: any;
  table2: any;
  table3: any;
  table4: any;
  table5: any;
  total1 = 0;
  total2 = 0;
  total3 = 0;
  total4 = 0;
  total5 = 0;
  ttotal1: any;
  data: any[] = [];
  labels: any[] = [];
  basicData: any;
  basicData2: any;
  basicData3: any;
  data2: any[] = [];
  data3: any[] = [];
  labels2: any[] = [];
  labels3: any[] = [];
  basicOptions: any;
  startDate?: dayjs.Dayjs | null;
  finishDate?: dayjs.Dayjs | null;

  editForm = this.fb.group({
    startDate: [],
    finishDate: [],
  });

  constructor(protected statisticService: StatisticService, protected fb: FormBuilder) {}

  allPertinences(): void {
    this.statisticService.byCategories(this.startDate!, this.finishDate!).subscribe((response: HttpResponse<IStatistic[]>) => {
      this.table1 = response.body;
      this.ttotal1 = 0;
      this.table1.forEach((element: { col2: any; col3: any }) => {
        this.total1 += element.col2;
        this.ttotal1 += element.col3;
      });
      this.ttotal1 += this.total1;
    });

    this.statisticService.byDirection().subscribe((response: HttpResponse<IStatistic[]>) => {
      this.table2 = response.body;
      this.table2.forEach((element: { col1: any; col2: any }) => {
        this.total2 += element.col2;
        this.data3.push(element.col2 / (this.total2 * 100));
        this.labels3.push(element.col1);
      });
    });

    this.statisticService.byContributor().subscribe((response: HttpResponse<IStatistic[]>) => {
      this.table3 = response.body;
      this.table3.forEach((element: { col2: any }) => {
        this.total3 += element.col2;
      });
    });

    this.statisticService.volumeByDirection().subscribe((response: HttpResponse<IStatistic[]>) => {
      this.table4 = response.body;
      this.table4.forEach((element: { col1: any; col2: any; col3: any }) => {
        this.total4 += element.col2;
        this.data2.push(element.col2 / (this.total4 * 100));
        this.labels2.push(element.col1);
      });
    });

    this.statisticService.volumeByCategory().subscribe((response: HttpResponse<IStatistic[]>) => {
      this.table5 = response.body;
      this.table5.forEach((element: { col1: any; col2: any }) => {
        this.total5 += element.col2;
        this.data.push(element.col2);
        this.labels.push(element.col1);
      });
      this.basicData = {
        labels: this.labels,
        datasets: [
          {
            label: '',
            backgroundColor: ['#9966FF', '#0000CC', '#FF0000', '#42A5F8', '#66BB6A', '#FFCC00', '#009900'],
            data: this.data,
          },
        ],
      };

      this.basicData2 = {
        labels: this.labels2,
        datasets: [
          {
            label: 'cumulée 2022',
            backgroundColor: ['#009900', '#FFCC00', '#FF0000', '#42A5F8', '#66BB6A', '#9966FF', '#009900'],
            data: this.data2,
          },
          {
            label: 'juil2022',
            backgroundColor: ['#FF0000', '#42A5F8', '#66BB6A', '#FFCC00', '#009900'],
            data: this.data2,
          },
        ],
      };

      this.basicData3 = {
        labels: this.labels3,
        datasets: [
          {
            label: 'cumulée 2022',
            backgroundColor: ['#9966FF', '#0000CC', '#FF8000', '#42A5F8', '#66BB6A', '#008080', '#800040'],
            data: this.data3,
          },
          {
            label: 'juil2022',
            backgroundColor: ['#FF0000', '#FFFF00', '#00FFFF', '#FFCC00', '#009900'],
            data: this.data3,
          },
        ],
      };
    });
  }
  ngOnInit(): void {
    this.allPertinences();
  }

  filter(): void {
    this.startDate = this.editForm.get(['startDate'])!.value;
    this.finishDate = this.editForm.get(['finishDate'])!.value;
    this.allPertinences();
  }

  protected updateForm(statistic: IStatistic): void {
    this.editForm.patchValue({
      startDate: statistic.startDate,
      finishDate: statistic.finishDate,
    });
  }
}
