import dayjs from 'dayjs/esm';

export interface IStatistic {
  col1?: string | null;
  col2?: number;
  col3?: number;
  total?: number;
  startDate?: dayjs.Dayjs | null;
  finishDate?: dayjs.Dayjs | null;
}

export class Statistic implements IStatistic {
  constructor(
    public col1?: string | null,
    public col2?: number,
    public col3?: number,
    public total?: number,
    public startDate?: dayjs.Dayjs | null,
    public finishDate?: dayjs.Dayjs | null
  ) {}
}
