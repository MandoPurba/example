import { autoAbsentCron } from '../services/autoAbsentCron.js';

export const startAttendanceCron = () => {
  autoAbsentCron();
  console.log("🕒 Attendance Cron Started");
};