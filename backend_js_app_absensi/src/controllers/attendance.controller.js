import Attendance from '../../models/attendance.model.js';
import FaceAttendanceCheckIn from '../../models/face_attendance_check_in.model.js';
import {
  Model,
  Op
} from 'sequelize';
import FaceAttendanceCheckOut from '../../models/face_attendance_check_out.model.js';
import User from '../../models/user.model.js';
import Branch from '../../models/branch.model.js';
import UserShiftSchedule from '../../models/user_shift_schedule.model.js';
import Shift from '../../models/shift.js';
import moment from 'moment';
import {
  calculateDistance
} from '../utils/all.js';
import UserProfile from '../../models/user_profile.model.js';

/* =========================
   GET ALL
========================= */


export const getAllAttendances = async (req, res) => {
  try {
    const result = await Attendance.findAll({
      include: [{
        model: User,
        as: "user",
        attributes: ["id", "username"],
      }]
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getAttendanceByUserId = async (req, res) => {
  const {
    userId
  } = req.params;
  try {
    const result = await Attendance.findAll({
      where: {
        user_id: userId,
      }
    });

    res.json({
      success: true,
      data: result || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getInsightAttendanceByUserId = async (req, res) => {
  const {
    userId
  } = req.params;

  try {
    const attendances = await Attendance.findAll({
      where: {
        user_id: userId,
      },
    });
    const labels = [
      "Present",
      "Late",
      "Absent",
      "Leave",
      "Off",
      "Half Day",
      "Overtime",
    ];

    const colors = [
      "#22C55E", // Present
      "#F59E0B", // Late
      "#EF4444", // Absent
      "#3B82F6", // Leave
      "#6B7280", // Off
      "#8B5CF6", // Half Day
      "#06B6D4", // Overtime
    ];

    const insight = {
      Present: 0,
      Late: 0,
      Absent: 0,
      Leave: 0,
      Off: 0,
      HalfDay: 0,
      Overtime: 0,
    };

    if (attendances?.length) {
      attendances.forEach((attendance) => {
        const status = attendance?.status ?? "";

        switch (status) {
          case "Present":
            insight.Present++;
            break;

          case "Absent":
            insight.Absent++;
            break;

          case "Leave":
            insight.Leave++;
            break;

          case "Off":
            insight.Off++;
            break;

          case "Half Day":
            insight.HalfDay++;
            break;

          default:
            break;
        }

        if ((attendance?.lateMinutes ?? 0) > 0) {
          insight.Late++;
        }

        if ((attendance?.overtimeMinutes ?? 0) > 0) {
          insight.Overtime++;
        }
      });
    }

    const series = [
      insight.Present,
      insight.Late,
      insight.Absent,
      insight.Leave,
      insight.Off,
      insight.HalfDay,
      insight.Overtime,
    ].map((value) => Number(value ?? 0));
    return res.status(200).json({
      success: true,
      data: {
        labels,
        colors,
        series,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
/* =========================
   GET TODAY ATTENDANCE FOR USER (SUPPORT CROSSDAY)
========================= */
export const getAttendanceUserByToday = async (req, res) => {
  try {
    const {
      userId
    } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch user with shift info
    const user = await User.findByPk(userId, {
      include: [{
        model: UserProfile,
        as: 'user_profile',
        include: [{
          model: Shift,
          as: 'shift'
        }],
      }, ],
    });

    if (!user || !user.user_profile || !user.user_profile.shift) {
      return res.status(404).json({
        success: false,
        message: "User or shift not found",
      });
    }

    const shift = user.user_profile.shift;

    // Determine workDate based on crossDay
    let workDate = moment().startOf('day');
    const shiftStart = moment(shift.startTime, 'HH:mm:ss');
    const currentTime = moment();

    if (shift.crossDay && currentTime.isBefore(shiftStart)) {
      workDate = workDate.subtract(1, 'day');
    }

    // Find today's attendance for this user and shift
    const attendance = await Attendance.findOne({
      where: {
        user_id: userId,
        shift_id: shift.id,
        workDate: workDate.format('YYYY-MM-DD'),
      },
      include: [{
          model: FaceAttendanceCheckIn,
          as: 'faceCheckIns'
        },
        {
          model: FaceAttendanceCheckOut,
          as: 'faceCheckOuts'
        },
        {
          model: Shift,
          as: 'shift'
        },
      ],
    });

    return res.json({
      success: true,
      data: attendance || null,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET BY ID
========================= */
export const getAttendanceById = async (req, res) => {
  try {
    const result = await Attendance.findByPk(req.params.id, {
      include: [{
          model: FaceAttendanceCheckIn,
          as: 'faceCheckIns'
        },
        {
          model: FaceAttendanceCheckOut,
          as: 'faceCheckOuts'
        },
      ],
    });

    res.json({
      success: true,
      data: result || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

/* =========================
   CREATE (CHECK IN)
========================= */
export const createAttendance = async (req, res) => {
  try {
    const {
      face_result,
      body
    } = req;
    const {
      userId,
      latitude_checkIn,
      longitude_checkIn,
      status,
      note
    } = body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const checkInTime = moment();

    // Fetch user with assigned branch
    const user = await User.findByPk(userId, {
      include: [{
        model: Branch,
        as: "branches",
        through: {
          attributes: []
        },
      }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const branches = user.branches;

    if (!branches) {
      return res.status(400).json({
        success: false,
        error: "User is not assigned to any branch",
      });
    }

    // Fetch today's shift schedule
    const schedule = await UserShiftSchedule.findAll({
      where: {
        user_id: userId,
        status: 'schedule'
      },
    });

    const profile = await UserProfile.findOne({
      where: {
        user_id: userId
      },
      include: [{
        model: Shift,
        as: 'shift'
      }],
    });


    const findCheckInForScheduleToday = schedule.some((s) =>
      moment(s.workDate).isSame(checkInTime, 'day')
    );

    if (!findCheckInForScheduleToday) {
      return res.status(400).json({
        success: false,
        error: "No shift schedule found for today",
      });
    }


    const shift = profile.shift;

    // Determine attendance date (workDate) considering crossDay shifts
    let workDate = moment().startOf('day'); // default today
    const shiftStart = moment(shift.startTime, 'HH:mm:ss');
    const shiftEnd = moment(shift.endTime, 'HH:mm:ss');

    if (shift.crossDay) {
      // If current time is before shift start (after midnight), assign to previous day
      if (checkInTime.isBefore(shiftStart)) {
        workDate = workDate.subtract(1, 'day');
      }
    }

    // Check if user already checked in for this shift and workDate
    const existing = await Attendance.findOne({
      where: {
        user_id: userId,
        shift_id: shift.id,
        workDate: workDate.format('YYYY-MM-DD')
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Already checked in for this schedule",
      });
    }

    // =========================
    // LOCATION VALIDATION FOR MULTIPLE BRANCHES
    // =========================

    // Helper: calculateDistance(lat1, lng1, lat2, lng2) must return distance in meters
    let nearestBranch = null;
    let minDistance = Infinity;

    for (const b of branches) {
      const dist = calculateDistance(
        parseFloat(latitude_checkIn),
        parseFloat(longitude_checkIn),
        parseFloat(b.latitude),
        parseFloat(b.longitude)
      );

      if (dist <= b.radius && dist < minDistance) {
        nearestBranch = b;
        minDistance = dist;
      }
    }

    if (!nearestBranch) {
      return res.status(400).json({
        success: false,
        error: "You are outside the radius of all assigned branches",
      });
    }

    // =========================
    // CREATE ATTENDANCE RECORD
    // =========================
    const attendanceRecord = await Attendance.create({
      user_id: userId,
      shift_id: shift.id,
      workDate: workDate.format('YYYY-MM-DD'),
      checkIn: checkInTime.toDate(),
      latitude_checkIn,
      longitude_checkIn,
      status: status || "Present",
      note,
    });

    // =========================
    // FACE ATTENDANCE RECORD
    // =========================
    if (face_result) {
      await FaceAttendanceCheckIn.create({
        attendance_id: attendanceRecord.id,
        score: face_result.score || null,
        type: face_result.type || null,
        imageUrl: face_result.image || null,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      data: attendanceRecord,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
/* =========================
   UPDATE
========================= */
/* =========================
   UPDATE (CHECK OUT) USING CROSSDAY SHIFT
========================= */
export const updateAttendance = async (req, res) => {
  try {
    const {
      face_result,
      body,
      params
    } = req;
    const {
      checkOut,
      latitude_checkOut,
      longitude_checkOut,
      status,
      note,
    } = body;

    const {
      userId
    } = params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch user with assigned branches
    const user = await User.findByPk(userId, {
      include: [{
          model: Branch,
          as: 'branches',
          through: {
            attributes: []
          },
        },
        {
          model: UserProfile,
          as: 'user_profile',
          include: [{
            model: Shift,
            as: 'shift'
          }],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const branches = user.branches;
    if (!branches || branches.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to any branch",
      });
    }
    const shift = user.user_profile.shift;
    if (!shift) {
      return res.status(400).json({
        success: false,
        message: "User shift not found",
      });
    }

    // Determine workDate based on crossDay
    let workDate = moment().startOf('day');
    const shiftStart = moment(shift.startTime, 'HH:mm:ss');
    const shiftEnd = moment(shift.endTime, 'HH:mm:ss');

    const currentTime = moment();

    if (shift.crossDay) {
      if (currentTime.isBefore(shiftStart)) {
        workDate = workDate.subtract(1, 'day');
      }
    }

    // Find the attendance record for this user, shift, and workDate
    const attendance = await Attendance.findOne({
      where: {
        user_id: userId,
        shift_id: shift.id,
        workDate: workDate.format('YYYY-MM-DD'),
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found for today’s shift",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Already checked out",
      });
    }

    // =========================
    // LOCATION VALIDATION FOR MULTIPLE BRANCHES
    // =========================
    let nearestBranch = null;
    let minDistance = Infinity;

    for (const b of branches) {
      const dist = calculateDistance(
        parseFloat(latitude_checkOut),
        parseFloat(longitude_checkOut),
        parseFloat(b.latitude),
        parseFloat(b.longitude)
      );

      if (dist <= b.radius && dist < minDistance) {
        nearestBranch = b;
        minDistance = dist;
      }
    }

    if (!nearestBranch) {
      return res.status(400).json({
        success: false,
        error: "You are outside the radius of all assigned branches",
      });
    }

    // =========================
    // SHIFT BASED CALCULATION
    // =========================
    const checkOutTime = checkOut ? new Date(checkOut) : new Date();

    let overtimeMinutes = 0;
    const shiftEndDate = new Date(`${workDate.format('YYYY-MM-DD')} ${shift.endTime}`);
    if (shift.crossDay) shiftEndDate.setDate(shiftEndDate.getDate() + 1);

    if (checkOutTime > shiftEndDate) {
      overtimeMinutes = Math.floor((checkOutTime.getTime() - shiftEndDate.getTime()) / 60000);
    }

    // =========================
    // UPDATE ATTENDANCE RECORD
    // =========================
    await Attendance.update({
      checkOut: checkOutTime,
      latitude_checkOut,
      longitude_checkOut,
      status: status || attendance.status,
      note: note || attendance.note,
      overtimeMinutes,
    }, {
      where: {
        id: attendance.id
      }
    });

    // =========================
    // FACE ATTENDANCE RECORD
    // =========================
    if (face_result) {
      await FaceAttendanceCheckOut.create({
        attendance_id: attendance.id,
        score: face_result.score || null,
        type: face_result.type || null,
        imageUrl: face_result.image || null,
      });
    }

    const result = await Attendance.findByPk(attendance.id);

    return res.json({
      success: true,
      message: "Attendance updated successfully",
      data: result,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
/* =========================
   UPDATE (CHECK OUT) WITH MULTI-BRANCH VALIDATION
========================= */
// export const updateAttendance = async (req, res) => {
//   try {
//     const {
//       face_result,
//       params,
//       body
//     } = req;
//     const {
//       id
//     } = params;
//     const {
//       checkOut,
//       latitude_checkOut,
//       longitude_checkOut,
//       status,
//       note,
//     } = body;

//     const attendance = await Attendance.findByPk(id, {
//       include: [{
//           model: Shift,
//           as: 'shift',
//         },
//         {
//           model: User,
//           as: 'user',
//           include: [{
//             model: Branch,
//             as: 'branches',
//             through: {
//               attributes: []
//             },
//           }, ],
//         },
//       ],
//     });

//     if (!attendance) {
//       return res.status(404).json({
//         success: false,
//         message: "Attendance not found",
//       });
//     }

//     if (attendance.checkOut) {
//       return res.status(400).json({
//         success: false,
//         message: "Already checked out",
//       });
//     }

//     // =========================
//     // LOCATION VALIDATION FOR MULTIPLE BRANCHES
//     // =========================
//     const branches = attendance.user.branches;
//     if (!branches || branches.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "User is not assigned to any branch",
//       });
//     }

//     let nearestBranch = null;
//     let minDistance = Infinity;

//     for (const b of branches) {
//       const dist = calculateDistance(
//         parseFloat(latitude_checkOut),
//         parseFloat(longitude_checkOut),
//         parseFloat(b.latitude),
//         parseFloat(b.longitude)
//       );

//       if (dist <= b.radius && dist < minDistance) {
//         nearestBranch = b;
//         minDistance = dist;
//       }
//     }

//     if (!nearestBranch) {
//       return res.status(400).json({
//         success: false,
//         error: "You are outside the radius of all assigned branches",
//       });
//     }

//     // =========================
//     // SHIFT BASED CALCULATION
//     // =========================
//     const shift = attendance.shift;
//     const checkOutTime = checkOut ? new Date(checkOut) : new Date();

//     let overtimeMinutes = 0;

//     if (shift && shift.endTime) {
//       const shiftEnd = new Date(`${attendance.workDate} ${shift.endTime}`);
//       if (shift.crossDay) shiftEnd.setDate(shiftEnd.getDate() + 1);

//       if (checkOutTime > shiftEnd) {
//         overtimeMinutes = Math.floor((checkOutTime.getTime() - shiftEnd.getTime()) / 60000);
//       }
//     }

//     // =========================
//     // UPDATE ATTENDANCE RECORD
//     // =========================
//     await Attendance.update({
//       checkOut: checkOutTime,
//       latitude_checkOut,
//       longitude_checkOut,
//       status: status || attendance.status,
//       note: note || attendance.note,
//       overtimeMinutes,
//     }, {
//       where: {
//         id
//       }
//     });

//     // =========================
//     // FACE ATTENDANCE RECORD
//     // =========================
//     if (face_result) {
//       await FaceAttendanceCheckOut.create({
//         attendance_id: id,
//         score: face_result.score || null,
//         type: face_result.type || null,
//         imageUrl: face_result.image || null,
//       });
//     }

//     const result = await Attendance.findByPk(id);

//     return res.json({
//       success: true,
//       message: "Attendance updated successfully",
//       data: result,
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };
/* =========================
   DELETE
========================= */
export const deleteAttendance = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: "Attendance not found",
      });
    }

    await Attendance.destroy({
      where: {
        id
      },
    });

    return res.json({
      success: true,
      message: "Attendance deleted successfully",
      data: attendance,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};