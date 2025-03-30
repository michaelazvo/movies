export class Person {
  static clone(p: Partial<Person> | null | undefined): Person | null {
    if (!p || p.id == null || p.krstneMeno == null || p.priezvisko == null) {
      return null;
    }
    return new Person(
      p.id,
      p.krstneMeno,
      p.stredneMeno ?? '',
      p.priezvisko
    );
  }

  constructor(
    public id: number,
    public krstneMeno: string,
    public stredneMeno: string,
    public priezvisko: string
  ) {}
}
