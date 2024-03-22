import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class RefreshToken {
    @IsNotEmpty()
    token: string
}
