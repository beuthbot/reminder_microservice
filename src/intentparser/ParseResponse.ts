import {Reminder} from "../model/Reminder";

export class ParseResponse{
    errorMessage?: string;
    success: boolean;
    reminders?: Reminder[];
    message?: string;
    constructor(success: boolean, successMessage?:string, errorMessage?: string) {
        this.success = success;
        this.message = successMessage;
        this.errorMessage = errorMessage;
    }
    setSuccess(successMessage:string){
        this.errorMessage = null;
        this.success = true;
        this.message = successMessage;
        return this;
    }
    setError(errorMessage: string){
        this.message = null;
        this.errorMessage = errorMessage;
        this.success = false;
        return this;
    }
}
