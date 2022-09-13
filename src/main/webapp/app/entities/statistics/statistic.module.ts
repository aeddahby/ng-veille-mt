import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { StatisticComponent } from './statistic.component';
import { StatisticRoutingModule } from './statistic-routing.module';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [StatisticComponent],
  imports: [CommonModule, SharedModule, StatisticRoutingModule, ChartModule],
})
export class StatisticModule {}
