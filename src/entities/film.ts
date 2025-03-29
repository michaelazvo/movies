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
    public poradieVRebricku: {[name: string]: number},
    public id?: number
  ){}

  static clone(json: any): Film {
    return new Film(
      json.nazov,
      json.rok,
      json.slovenskyNazov,
      json.imdbID,
      // Map directors using Person.clone and filter out any null values
      json.reziser
        ? json.reziser
            .map((r: any) => Person.clone(r))
            .filter((r: Person | null): r is Person => r !== null)
        : [],
      // Do the same for characters. (Make sure Postava.clone handles null similarly.)
      json.postava
        ? json.postava
            .map((p: any) => Postava.clone(p))
            .filter((p: Postava | null): p is Postava => p !== null)
        : [],
      { ...json.poradieVRebricku },
      json.id
    );
  }
}