import { Person } from "./person";

export class Postava {
  static clone(p: any): Postava | null {
    if (!p) return null;
    const clonedHerec = Person.clone(p.herec);
    if (!clonedHerec) {
      return null;
    }
    return new Postava(
      p.postava,
      p.dolezitost,
      clonedHerec
    );
  }

  constructor(
    public postava: string,
    public dolezitost: "hlavná postava" | "vedľajšia postava",
    public herec: Person
  ){}
}