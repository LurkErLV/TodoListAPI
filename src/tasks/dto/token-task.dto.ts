import { IsNotEmpty } from "class-validator";

export class TokenTaskDto {
    @IsNotEmpty()
    token: string;
}
