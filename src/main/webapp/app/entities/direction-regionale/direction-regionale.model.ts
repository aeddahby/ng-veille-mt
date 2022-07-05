export interface IDirectionRegionale {
  id?: number;
  name?: string | null;
}

export class DirectionRegionale implements IDirectionRegionale {
  constructor(public id?: number, public name?: string | null) {}
}

export function getDirectionRegionaleIdentifier(directionRegionale: IDirectionRegionale): number | undefined {
  return directionRegionale.id;
}
