import ReminderCron from "./ReminderCron";
import CleanupCron from "./CleanupCron";

export function registerCronjobs(){
    ReminderCron();
    CleanupCron();
}
