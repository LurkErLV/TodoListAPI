import { IsNotEmpty } from "class-validator";

export class UpdateTaskDto {
    @IsNotEmpty()
    task: string;
}
