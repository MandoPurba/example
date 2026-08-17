import cron from 'node-cron';
import { Op } from 'sequelize';

import UserShiftSchedule from '../../models/user_shift_schedule.js';
import Attendance from '../../models/attendance.model.js';
import Shift from '../../models/shift.js';
export const autoAbsentCron = () => {

  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log("🚀 Running Auto Absent Cron...");

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      const schedules = await UserShiftSchedule.findAll({
        where: {
          workDate: today,
          status: 'scheduled'
        },
        include: [{ model: Shift, as: 'shift' }]
      });

      for (const schedule of schedules) {

        const attendance = await Attendance.findOne({
          where: {
            user_id: schedule.user_id,
            shift_id: schedule.shift_id,
            workDate: schedule.workDate
          }
        });

        if (attendance) continue;

        let shiftEnd = new Date(`${schedule.workDate} ${schedule.shift.endTime}`);

        if (schedule.shift.crossDay) {
          shiftEnd.setDate(shiftEnd.getDate() + 1);
        }

        const graceEnd = new Date(shiftEnd);
        graceEnd.setMinutes(graceEnd.getMinutes() + schedule.shift.graceMinutes);

        if (now < graceEnd) continue;

        await Attendance.create({
          user_id: schedule.user_id,
          shift_id: schedule.shift_id,
          workDate: schedule.workDate,
          status: 'Absent',
          note: 'Auto absent system'
        });

        console.log(`❌ Auto absent: ${schedule.user_id}`);
      }

      console.log("✅ Cron finished");

    } catch (err) {
      console.error("❌ Cron error:", err);
    }
  });
};