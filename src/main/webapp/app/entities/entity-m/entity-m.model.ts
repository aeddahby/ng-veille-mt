export interface IEntityM {
  id?: number;
  title?: string | null;
}

export class EntityM implements IEntityM {
  constructor(public id?: number, public title?: string | null) {}
}

export function getEntityMIdentifier(entityM: IEntityM): number | undefined {
  return entityM.id;
}
