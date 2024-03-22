import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    login: string;

    @IsNotEmpty()
    @Length(5, 20)
    password: string;
}
