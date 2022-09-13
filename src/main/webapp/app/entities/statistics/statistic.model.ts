export interface IStatistic {
  col1?: string | null;
  col2?: number;
  col3?: number;
  total?: number;
}

export class Statistic implements IStatistic {
  constructor(public col1?: string | null, public col2?: number, public col3?: number, public total?: number) {}
}
