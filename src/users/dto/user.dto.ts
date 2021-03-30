export class UserDto {
  public readonly name: string;
  public readonly surname: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly features: [];
  public readonly friends: [];
  public readonly towns: [];
  public readonly hobby: [];
  public readonly birthDayDate: Date;
  constructor(object: any) {
    this.name = object.name;
    this.surname = object.surname;
    this.email = object.email;
    this.phone = object.phone;
    this.birthDayDate = object.birthDayDate;
    this.features = object.features;
    this.friends = object.friends;
    this.towns = object.towns;
    this.hobby = object.hobby;
  }}
