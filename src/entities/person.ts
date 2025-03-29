export class Person {

  static clone(p: Person): Person | null {
    if (!p) {
      return null;
    }
    return new Person(p.id, p.krstneMeno, p.stredneMeno, p.priezvisko);
  }

  constructor(
    public id: number,
    public krstneMeno: string,
    public stredneMeno: string,
    public priezvisko: string
  ){}
}