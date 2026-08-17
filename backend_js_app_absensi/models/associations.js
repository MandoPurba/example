import User from "./user.model.js";
import Branch from "./branch.model.js";
import Attendance from "./attendance.model.js";
import VectorFace from "./vector_face.model.js";
import UserBranch from "./user_branch.model.js";
import WorkSchedule from "./work_schedule.model.js";
import Holiday from "./holiday.model.js";
import FaceAttendanceCheckIn from "./face_attendance_check_in.model.js";
import FaceAttendanceCheckOut from "./face_attendance_check_out.model.js";
import UserProfile from "./user_profile.model.js";
import Shift from "./shift.js";
import UserShiftSchedule from "./user_shift_schedule.model.js";
import Department from "./department.model.js";
import AccessRouteDepartment from "./access_route_department.model.js";
import FrontendRoute from "./frontend_route.model.js";
import BackendRoute from "./backend_route.model.js";
import FrontendSubItem from "./frontend_subItem.model.js";
import FrontendBackend from "./frontend_backend.model.js";
import SubItemFrontendRoute from "./subitem_frontend_route.model.js";
import SubItemFrontendBackend from "./subitem_frontend_backend.model.js";
import Permission from "./permission.model.js";
/* =========================
   USER ↔ BRANCH (MANY TO MANY)
========================= */
User.belongsToMany(Branch, {
  through: UserBranch,
  as: "branches",
  foreignKey: "user_id",
  otherKey: "branch_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Branch.belongsToMany(User, {
  through: UserBranch,
  as: "users",
  foreignKey: "branch_id",
  otherKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FrontendRoute.belongsToMany(BackendRoute, {
  through: FrontendBackend,
  as: "backend_routes",
  foreignKey: "frontend_route_id",
  otherKey: "backend_route_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});



BackendRoute.belongsToMany(FrontendRoute, {
  through: FrontendBackend,
  as: "frontend_routes",
  foreignKey: "backend_route_id",
  otherKey: "frontend_route_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SubItemFrontendRoute.belongsToMany(BackendRoute, {
  through: SubItemFrontendBackend,
  as: "backend_routes",
  foreignKey: "subitem_frontend_route_id",
  otherKey: "backend_route_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BackendRoute.belongsToMany(SubItemFrontendRoute, {
  through: SubItemFrontendBackend,
  as: "subitem_frontend_routes",
  foreignKey: "backend_route_id",
  otherKey: "frontend_route_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FrontendRoute.belongsToMany(FrontendSubItem, {
  through: FrontendSubItem,
  as: "subitems",
  foreignKey: "frontend_route_id",
  otherKey: "subitem_frontend_route_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FrontendSubItem.belongsToMany(FrontendRoute, {
  through: FrontendSubItem,
  as: "frontend_routes",
  foreignKey: "subitem_frontend_route_id",
  otherKey: "frontend_route_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Department.belongsToMany(SubItemFrontendRoute, {
  through: AccessRouteDepartment,
  as: "subitem_access_routes",
  foreignKey: "department_id",
  otherKey: "subitem_frontend_route_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SubItemFrontendRoute.belongsToMany(Department, {
  through: AccessRouteDepartment,
  as: "subitem_frontend_departments",
  foreignKey: "subitem_frontend_route_id",
  otherKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Department.belongsToMany(FrontendRoute, {
  through: AccessRouteDepartment,
  as: "frontend_access_routes",
  foreignKey: "department_id",
  otherKey: "frontend_route_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FrontendRoute.belongsToMany(Department, {
  through: AccessRouteDepartment,
  as: "frontend_departments",
  foreignKey: "frontend_route_id",
  otherKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


FrontendRoute.hasMany(SubItemFrontendRoute, {
  foreignKey: "child_of_frontend_route_id",
  as: "sub_items",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SubItemFrontendRoute.belongsTo(FrontendRoute, {
  foreignKey: "child_of_frontend_route_id",
  as: "frontend_route",
});

/* Tambahan untuk akses ke pivot table langsung */
Department.hasMany(AccessRouteDepartment, {
  foreignKey: "department_id",
  as: "access_route_departments",
});

AccessRouteDepartment.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

FrontendRoute.hasMany(AccessRouteDepartment, {
  foreignKey: "frontend_route_id",
  as: "access_route_departments",
});

AccessRouteDepartment.belongsTo(FrontendRoute, {
  foreignKey: "frontend_route_id",
  as: "frontend_route",
});

SubItemFrontendRoute.hasMany(AccessRouteDepartment, {
  foreignKey: "subitem_frontend_route_id",
  as: "subitem_access_route_departments",
});

AccessRouteDepartment.belongsTo(SubItemFrontendRoute, {
  foreignKey: "subitem_frontend_route_id",
  as: "subitem_frontend_route",
});
/* =========================
   USER ↔ ATTENDANCE (ONE TO MANY)
========================= */
User.hasMany(Attendance, {
  foreignKey: "user_id",
  as: "attendances",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Attendance.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/* =========================
   USER ↔ VECTOR FACE (ONE TO MANY)
========================= */
User.hasOne(VectorFace, {
  foreignKey: "user_id",
  as: "vector_face",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

VectorFace.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/* =========================
   WORK SCHEDULE ↔ BRANCH & USER
========================= */
Branch.hasMany(WorkSchedule, {
  foreignKey: "branch_id",
  as: "schedules",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(WorkSchedule, {
  foreignKey: "user_id",
  as: "schedules",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

/* =========================
   HOLIDAY ↔ BRANCH
========================= */
Branch.hasMany(Holiday, {
  foreignKey: "branch_id",
  as: "holidays",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

/* =========================
   ATTENDANCE ↔ FACE ATTENDANCE (ONE TO MANY)
========================= */
Attendance.hasMany(FaceAttendanceCheckIn, {
  foreignKey: "attendance_id",
  as: "faceCheckIns",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FaceAttendanceCheckIn.belongsTo(Attendance, {
  foreignKey: "attendance_id",
  as: "attendance",
});

Attendance.hasMany(FaceAttendanceCheckOut, {
  foreignKey: "attendance_id",
  as: "faceCheckOuts",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FaceAttendanceCheckOut.belongsTo(Attendance, {
  foreignKey: "attendance_id",
  as: "attendance",
});

/* =========================
   USER ↔ user_profile (ONE TO ONE)
========================= */
User.hasOne(UserProfile, {
  foreignKey: "user_id",
  as: "user_profile",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

UserProfile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasOne(Permission, {
  foreignKey: "user_id",
  as: "permission",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Permission.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
/* =========================
   user_profile ↔ SHIFT (MANY TO ONE)
========================= */
UserProfile.belongsTo(Shift, {
  foreignKey: "shift_id",
  as: "shift",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Shift.hasMany(UserProfile, {
  foreignKey: "shift_id",
  as: "user_profiles",
});

/* =========================
   user_profile ↔ DEPARTMENT (MANY TO ONE)
========================= */
UserProfile.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Department.hasMany(UserProfile, {
  foreignKey: "department_id",
  as: "user_profiles",
});

/* =========================
   USER ↔ USERSHIFT SCHEDULE (ONE TO MANY)
========================= */
User.hasMany(UserShiftSchedule, {
  foreignKey: "user_id",
  as: "shift_schedules",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

UserShiftSchedule.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/* =========================
   SHIFT ↔ ATTENDANCE (ONE TO MANY)
========================= */
Shift.hasMany(Attendance, {
  foreignKey: "shift_id",
  as: "attendances",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Attendance.belongsTo(Shift, {
  foreignKey: "shift_id",
  as: "shift",
});


export {
  User,
  Branch,
  Attendance,
  VectorFace,
  UserBranch,
  WorkSchedule,
  Holiday,
  FaceAttendanceCheckIn,
  FaceAttendanceCheckOut,
  UserProfile,
  Shift,
  Department,
  UserShiftSchedule,
  AccessRouteDepartment,
  BackendRoute,
  FrontendRoute,
  FrontendSubItem,
  SubItemFrontendRoute,
  FrontendBackend,
  Permission
};