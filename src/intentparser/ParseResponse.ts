import {Reminder} from "../model/Reminder";

export class ParseResponse{
    errorMessage?: string;
    success: boolean;
    reminder?: Reminder;
    constructor(success: boolean, errorMessage?: string) {
        this.success = success;
        this.errorMessage = errorMessage;
    }
    setError(errorMessage: string){
        this.errorMessage = errorMessage;
        this.success = false;
        return this;
    }
}
