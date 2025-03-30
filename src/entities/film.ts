import { Person } from "./person";
import { Postava } from "./postava";

export class Film {
  constructor(
    public nazov: string,
    public rok: number,
    public slovenskyNazov: string,
    public imdbID: string,
    public reziser: Person[],
    public postava: Postava[],
    public poradieVRebricku: { [name: string]: number },
    public id?: number
  ) {}

  static clone(json: Partial<Film>): Film {
    const reziser: Person[] = (json.reziser ?? [])
      .map(Person.clone)
      .filter((r): r is Person => r !== null);

    const postava: Postava[] = (json.postava ?? [])
      .map(Postava.clone)
      .filter((p): p is Postava => p !== null);

    return new Film(
      json.nazov ?? '',
      json.rok ?? 0,
      json.slovenskyNazov ?? '',
      json.imdbID ?? '',
      reziser,
      postava,
      { ...(json.poradieVRebricku ?? {}) },
      json.id
    );
  }
}
