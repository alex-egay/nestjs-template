export class CreateUserDto {
  public readonly name: string;
  public readonly surname: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly birthDayDate: Date;
  public readonly friends: [];
  public readonly towns: [];
  public readonly hobby: [];
  public features: object[];
  public password: string;
}
