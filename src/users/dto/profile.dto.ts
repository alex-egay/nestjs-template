export class ProfileDto {
  public readonly email: string;
  public readonly name: string;
  public readonly surname: string;
  public readonly birthDayDate: Date;
  public readonly features: [];
  public readonly friends: [];
  public readonly towns: [];
  public readonly hobby: [];
  public readonly phone: string;
  constructor(object: any) {
    this.email = object.email;
    this.name = object.name;
    this.surname = object.surname;
    this.birthDayDate = object.birthDayDate;
    this.phone = object.phone;
    this.features = object.features;
    this.friends = object.friends;
    this.towns = object.towns;
    this.hobby = object.hobby;
  }}
