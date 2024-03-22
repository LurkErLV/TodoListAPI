import { IsNotEmpty } from "class-validator";

export class ToggleDoneTaskDto {
    @IsNotEmpty()
    token: string;
}
