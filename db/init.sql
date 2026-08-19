--
-- PostgreSQL database dump
--


-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_attendance_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_attendance_status AS ENUM (
    'Present',
    'Late',
    'Absent',
    'Leave',
    'Off',
    'Half Day',
    'Overtime'
);


--
-- Name: enum_permissions_permission_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_permissions_permission_type AS ENUM (
    'izin',
    'sakit',
    'cuti',
    'dinas_luar'
);


--
-- Name: enum_permissions_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_permissions_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: enum_user_profile_gender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_user_profile_gender AS ENUM (
    'male',
    'female',
    'other'
);


--
-- Name: enum_user_shift_schedule_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_user_shift_schedule_status AS ENUM (
    'schedule',
    'off',
    'leave'
);


--
-- Name: enum_work_schedule_day; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_work_schedule_day AS ENUM (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


--
-- Name: access_route_department; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access_route_department (
    id uuid NOT NULL,
    frontend_route_id uuid,
    subitem_frontend_route_id uuid,
    department_id uuid,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    shift_id uuid,
    "workDate" date NOT NULL,
    "checkIn" timestamp with time zone,
    "checkOut" timestamp with time zone,
    "latitude_checkIn" double precision,
    "longitude_checkIn" double precision,
    "latitude_checkOut" double precision,
    "longitude_checkOut" double precision,
    status public.enum_attendance_status DEFAULT 'Present'::public.enum_attendance_status NOT NULL,
    "lateMinutes" integer DEFAULT 0,
    "earlyLeaveMinutes" integer DEFAULT 0,
    "overtimeMinutes" integer DEFAULT 0,
    "workHours" double precision DEFAULT '0'::double precision,
    "faceVerifiedCheckIn" boolean DEFAULT false,
    "faceVerifiedCheckOut" boolean DEFAULT false,
    "checkInDevice" character varying(255),
    "checkOutDevice" character varying(255),
    "ipAddressCheckIn" character varying(255),
    "ipAddressCheckOut" character varying(255),
    "isApproved" boolean DEFAULT true,
    "approvedBy" uuid,
    "approvedAt" timestamp with time zone,
    note text,
    "rejectionReason" text,
    "isManualEntry" boolean DEFAULT false,
    "isAutoCheckout" boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: backend_route; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backend_route (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    method character varying(255) NOT NULL,
    "isActive" boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Name: branch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.branch (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true,
    radius double precision NOT NULL,
    latitude double precision,
    longitude double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: department; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Name: face_attendance_check_in; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.face_attendance_check_in (
    id uuid NOT NULL,
    attendance_id uuid NOT NULL,
    score double precision,
    type text,
    "imageUrl" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: face_attendance_check_out; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.face_attendance_check_out (
    id uuid NOT NULL,
    attendance_id uuid NOT NULL,
    score double precision,
    type text,
    "imageUrl" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: frontend_backend; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.frontend_backend (
    id uuid NOT NULL,
    frontend_route_id uuid NOT NULL,
    backend_route_id uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: frontend_route; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.frontend_route (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(255),
    path character varying(255),
    sort integer,
    "isActive" boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Name: frontend_subitem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.frontend_subitem (
    id uuid NOT NULL,
    frontend_route_id uuid NOT NULL,
    subitem_frontend_route_id uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: holiday; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.holiday (
    id uuid NOT NULL,
    branch_id uuid,
    title character varying(255) NOT NULL,
    date date NOT NULL,
    "isNational" boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    permission_type public.enum_permissions_permission_type NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    description text,
    attachment_url character varying(255),
    approval_note text,
    approved_by uuid,
    approved_at timestamp with time zone,
    status public.enum_permissions_status DEFAULT 'pending'::public.enum_permissions_status NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Name: shift; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shift (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL,
    "crossDay" boolean DEFAULT false,
    "graceMinutes" integer DEFAULT 15,
    description text,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Name: subitem_frontend_backend; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subitem_frontend_backend (
    id uuid NOT NULL,
    subitem_frontend_route_id uuid NOT NULL,
    backend_route_id uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: subitem_frontend_route; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subitem_frontend_route (
    id uuid NOT NULL,
    child_of_frontend_route_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    "isActive" boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Name: token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token (
    id uuid NOT NULL,
    token character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id uuid NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'user'::character varying,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: user_branch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_branch (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profile (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    shift_id uuid NOT NULL,
    department_id uuid NOT NULL,
    status character varying(255) DEFAULT true NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    address text,
    gender public.enum_user_profile_gender,
    "dateOfBirth" date,
    department character varying(255),
    "position" character varying(255),
    bio text,
    image character varying(255),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_shift_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_shift_schedule (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    "workDate" date NOT NULL,
    status public.enum_user_shift_schedule_status DEFAULT 'schedule'::public.enum_user_shift_schedule_status,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Name: vector_face; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vector_face (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    vector json NOT NULL,
    image character varying(255),
    model character varying(255),
    confidence double precision,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: work_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_schedule (
    id uuid NOT NULL,
    user_id uuid,
    day public.enum_work_schedule_day NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260503021541-user.js
20260503021610-shift.js
20260503021613-department.js
20260503021614-permission.js
20260503021615-attendance.js
20260504075737-branch.js
20260506084044-token.js
20260506084054-user_branch.js
20260506084104-vector_face.js
20260506091750-work_schedule.js
20260506091845-holiday.js
20260507123235-face_attendance_checkIOut.js
20260507123235-face_attendance_checkIn.js
20260518031944-user_profile.js
20260519055943-user_shift_schedule.js
20260528130013-frontend_route.js
20260528130014-backend_route.js
20260528130015-subitem_frontend_route.js
20260528130016-frontend_subitem.js
20260528130017-frontend_backend.js
20260528130018-subitem_frontend_backend.js
20260529081220-access_route_department.js
\.


--
-- Data for Name: access_route_department; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.access_route_department (id, frontend_route_id, subitem_frontend_route_id, department_id, "createdAt", "updatedAt") FROM stdin;
6722dc0a-c45b-4b9a-818a-22b9973d816c	1bab0130-8cad-4834-a35b-17a708d46a4e	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
f8bc41ce-103e-42e4-8b42-f1c456cb3fd0	a448724f-be62-48bf-bb26-2f83ee2545f0	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
ae41a3ca-2745-480d-a47c-9ea1decacbc2	a6d17d1c-829f-4928-a583-cdd856eb2783	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
f5455070-086e-44b6-8f91-33a8c445f98b	f2d0d234-4eca-4a99-b5b7-a9f7da80f706	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
48864850-d9c4-4443-8d11-beccd265907e	729eaeb7-18f4-4ffb-890d-c24e546c2b0a	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
a430ea9a-5e17-44a1-aa54-5693190e87a4	b6267382-f232-4af1-bf44-4098064f0a75	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
a27e0a99-bbca-4c0b-9481-98feada1787d	783cb910-0441-4d86-b1c3-40e0473a6901	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
496dbe5a-e909-41d6-8990-f87a5d912b14	1d9eb12c-1ed4-481e-93da-ccdb9c3e3652	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
185b643f-be6d-48ed-bede-43b893e53645	70868673-9ead-42f2-82f6-4603de088a92	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
78591d21-f8e2-4735-ac6d-0139bf75675b	1b0e390e-e791-4d03-9950-da2c84b1e667	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
9f4a53ae-0769-49b4-97da-c6a5e8d10c60	a491bda1-5869-4012-92d2-c276fc2ec912	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
47c5aa2b-8417-472f-8552-f8c6ce7677fa	9a8b6f39-5f30-4511-8821-812fdec659c9	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
87b9cfd5-faad-483b-9430-f4ed2db1107b	90e0b423-9b6d-4635-8c0a-e039a938b93a	\N	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
b58a7a91-6926-410f-b27f-1181f3f2f39c	\N	c1022166-1439-427d-9661-72560c9a86bb	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
8e598f41-14b5-4dc7-b625-0fedb5396e7c	\N	59c51681-8b36-4130-bd9a-5e86353fd3ce	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
08e213b4-f0f3-4806-a36d-93e5307ded2e	\N	20b23fdf-fe38-4ffa-9ad8-343dc23eb0db	f830a281-1fa0-4382-8a61-477296ac5444	2026-08-19 02:10:51.784+00	2026-08-19 02:10:51.784+00
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance (id, user_id, shift_id, "workDate", "checkIn", "checkOut", "latitude_checkIn", "longitude_checkIn", "latitude_checkOut", "longitude_checkOut", status, "lateMinutes", "earlyLeaveMinutes", "overtimeMinutes", "workHours", "faceVerifiedCheckIn", "faceVerifiedCheckOut", "checkInDevice", "checkOutDevice", "ipAddressCheckIn", "ipAddressCheckOut", "isApproved", "approvedBy", "approvedAt", note, "rejectionReason", "isManualEntry", "isAutoCheckout", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: backend_route; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backend_route (id, name, path, method, "isActive", "createdAt", "updatedAt") FROM stdin;
a26ca907-a816-4592-a153-02a5ebd3a75e	Access Routes	/access-routes	GET	f	2026-08-19 02:10:51.752+00	2026-08-19 02:10:51.752+00
\.


--
-- Data for Name: branch; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.branch (id, name, code, city, address, "isActive", radius, latitude, longitude, "createdAt", "updatedAt") FROM stdin;
0295d184-23c4-4a83-9c65-592711e7989c	Jakarta Branch	JKT001	Jakarta	jl. Sudirman No. 1, Jakarta	t	100	3.5978979407269174	98.65418583379336	2026-08-19 02:10:51.744+00	2026-08-19 02:10:51.744+00
a1458635-9d5d-4926-ad5c-de5af255c69d	Bandung Branch	BDG001	Bandung	jl. Asia Afrika No. 1, Bandung	t	100	3.5978979407269174	98.65418583379336	2026-08-19 02:10:51.744+00	2026-08-19 02:10:51.744+00
a5520a32-4347-4359-b359-5e97c3e1f4bc	Medan Branch	MDN001	Medan	jl. Merdeka No. 1, Medan	t	100	3.5978979407269174	98.65418583379336	2026-08-19 02:10:51.744+00	2026-08-19 02:10:51.744+00
\.


--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.department (id, name, code, "isActive", "createdAt", "updatedAt") FROM stdin;
f830a281-1fa0-4382-8a61-477296ac5444	ADMIN	ADMIN-001	t	2026-08-19 02:10:51.76+00	2026-08-19 02:10:51.76+00
\.


--
-- Data for Name: face_attendance_check_in; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.face_attendance_check_in (id, attendance_id, score, type, "imageUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: face_attendance_check_out; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.face_attendance_check_out (id, attendance_id, score, type, "imageUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: frontend_backend; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.frontend_backend (id, frontend_route_id, backend_route_id, "createdAt", "updatedAt") FROM stdin;
9a72db3a-ccd1-4d45-bb49-bc96a9577717	a491bda1-5869-4012-92d2-c276fc2ec912	a26ca907-a816-4592-a153-02a5ebd3a75e	2026-08-19 02:10:51.763+00	2026-08-19 02:10:51.763+00
\.


--
-- Data for Name: frontend_route; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.frontend_route (id, name, icon, path, sort, "isActive", "createdAt", "updatedAt") FROM stdin;
a448724f-be62-48bf-bb26-2f83ee2545f0	Home	Home	/home	1	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
1bab0130-8cad-4834-a35b-17a708d46a4e	Admin Dashboard	Grid2x2	/insight	2	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
a6d17d1c-829f-4928-a583-cdd856eb2783	Absensi	Fingerprint	/absensi	4	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
f2d0d234-4eca-4a99-b5b7-a9f7da80f706	Register Face	ScanFace	/bio-metrics/face-recognition	5	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
e23bb046-1017-4020-8cee-fc983eaec257	Master	Box	\N	6	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
729eaeb7-18f4-4ffb-890d-c24e546c2b0a	Attendance	BookText	/attendance-user	7	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
b6267382-f232-4af1-bf44-4098064f0a75	History Absensi	History	/attendance-history	8	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
783cb910-0441-4d86-b1c3-40e0473a6901	Employee	Mail	/employee	9	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
1d9eb12c-1ed4-481e-93da-ccdb9c3e3652	Notification	Bell	/notification	10	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
70868673-9ead-42f2-82f6-4603de088a92	Message	Send	/message	11	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
1b0e390e-e791-4d03-9950-da2c84b1e667	Users	User	/users	12	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
a491bda1-5869-4012-92d2-c276fc2ec912	Access Route	ClosedCaption	/access-route	13	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
9a8b6f39-5f30-4511-8821-812fdec659c9	Permission	NotebookPen	/home/permission	14	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
90e0b423-9b6d-4635-8c0a-e039a938b93a	Absensi Bulanan	CalendarDays	/attendance-monthly	15	f	2026-08-19 02:10:51.756+00	2026-08-19 02:10:51.756+00
\.


--
-- Data for Name: frontend_subitem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.frontend_subitem (id, frontend_route_id, subitem_frontend_route_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: holiday; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.holiday (id, branch_id, title, date, "isNational", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, user_id, permission_type, start_date, end_date, start_time, end_time, description, attachment_url, approval_note, approved_by, approved_at, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: shift; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shift (id, name, code, "startTime", "endTime", "crossDay", "graceMinutes", description, "createdAt", "updatedAt") FROM stdin;
4e5c2047-ffdb-411c-85bd-4178651e730b	Shift Pagi	SHIFT-PAGI	08:00:00	17:00:00	f	15	Shift default 08:00 - 17:00	2026-08-19 02:10:51.777+00	2026-08-19 02:10:51.777+00
\.


--
-- Data for Name: subitem_frontend_backend; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subitem_frontend_backend (id, subitem_frontend_route_id, backend_route_id, "createdAt", "updatedAt") FROM stdin;
5fff8c68-ba78-492d-91a3-48e950a6c44a	c1022166-1439-427d-9661-72560c9a86bb	a26ca907-a816-4592-a153-02a5ebd3a75e	2026-08-19 02:10:51.774+00	2026-08-19 02:10:51.774+00
\.


--
-- Data for Name: subitem_frontend_route; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subitem_frontend_route (id, child_of_frontend_route_id, name, path, "isActive", "createdAt", "updatedAt") FROM stdin;
c1022166-1439-427d-9661-72560c9a86bb	e23bb046-1017-4020-8cee-fc983eaec257	Branch	/branch	f	2026-08-19 02:10:51.768+00	2026-08-19 02:10:51.768+00
59c51681-8b36-4130-bd9a-5e86353fd3ce	e23bb046-1017-4020-8cee-fc983eaec257	Shift	/shift	f	2026-08-19 02:10:51.768+00	2026-08-19 02:10:51.768+00
20b23fdf-fe38-4ffa-9ad8-343dc23eb0db	e23bb046-1017-4020-8cee-fc983eaec257	Department	/department	f	2026-08-19 02:10:51.768+00	2026-08-19 02:10:51.768+00
\.


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token (id, token, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, username, password, role, "isActive", "createdAt", "updatedAt") FROM stdin;
3de1607d-9b4b-4ff4-b316-687724de52c0	admin	$2b$10$osa1MI8zekGTwtBKYO50pO62q24p.V/wk.dRZMk0dcM9MZY3apm42	admin	t	2026-08-19 02:10:51.67+00	2026-08-19 02:10:51.67+00
\.


--
-- Data for Name: user_branch; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_branch (id, user_id, branch_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_profile (id, user_id, shift_id, department_id, status, name, email, phone, address, gender, "dateOfBirth", department, "position", bio, image, "createdAt", "updatedAt") FROM stdin;
52f6ca31-e003-4743-854c-f1b6ba686bd3	3de1607d-9b4b-4ff4-b316-687724de52c0	4e5c2047-ffdb-411c-85bd-4178651e730b	f830a281-1fa0-4382-8a61-477296ac5444	active	Administrator	admin@example.com	\N	\N	\N	\N	\N	Administrator	\N	\N	2026-08-19 02:10:51.78+00	2026-08-19 02:10:51.78+00
\.


--
-- Data for Name: user_shift_schedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_shift_schedule (id, user_id, "workDate", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: vector_face; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vector_face (id, user_id, vector, image, model, confidence, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: work_schedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.work_schedule (id, user_id, day, "startTime", "endTime", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: access_route_department access_route_department_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_route_department
    ADD CONSTRAINT access_route_department_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: backend_route backend_route_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backend_route
    ADD CONSTRAINT backend_route_name_key UNIQUE (name);


--
-- Name: backend_route backend_route_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backend_route
    ADD CONSTRAINT backend_route_pkey PRIMARY KEY (id);


--
-- Name: branch branch_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_code_key UNIQUE (code);


--
-- Name: branch branch_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_pkey PRIMARY KEY (id);


--
-- Name: department department_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_code_key UNIQUE (code);


--
-- Name: department department_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_name_key UNIQUE (name);


--
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (id);


--
-- Name: face_attendance_check_in face_attendance_check_in_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.face_attendance_check_in
    ADD CONSTRAINT face_attendance_check_in_pkey PRIMARY KEY (id);


--
-- Name: face_attendance_check_out face_attendance_check_out_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.face_attendance_check_out
    ADD CONSTRAINT face_attendance_check_out_pkey PRIMARY KEY (id);


--
-- Name: frontend_backend frontend_backend_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.frontend_backend
    ADD CONSTRAINT frontend_backend_pkey PRIMARY KEY (id);


--
-- Name: frontend_route frontend_route_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.frontend_route
    ADD CONSTRAINT frontend_route_name_key UNIQUE (name);


--
-- Name: frontend_route frontend_route_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.frontend_route
    ADD CONSTRAINT frontend_route_pkey PRIMARY KEY (id);


--
-- Name: frontend_subitem frontend_subitem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.frontend_subitem
    ADD CONSTRAINT frontend_subitem_pkey PRIMARY KEY (id);


--
-- Name: holiday holiday_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holiday
    ADD CONSTRAINT holiday_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: shift shift_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shift
    ADD CONSTRAINT shift_code_key UNIQUE (code);


--
-- Name: shift shift_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shift
    ADD CONSTRAINT shift_pkey PRIMARY KEY (id);


--
-- Name: subitem_frontend_backend subitem_frontend_backend_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subitem_frontend_backend
    ADD CONSTRAINT subitem_frontend_backend_pkey PRIMARY KEY (id);


--
-- Name: subitem_frontend_route subitem_frontend_route_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subitem_frontend_route
    ADD CONSTRAINT subitem_frontend_route_name_key UNIQUE (name);


--
-- Name: subitem_frontend_route subitem_frontend_route_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subitem_frontend_route
    ADD CONSTRAINT subitem_frontend_route_pkey PRIMARY KEY (id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: token token_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_token_key UNIQUE (token);


--
-- Name: access_route_department unique_access_route_department; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_route_department
    ADD CONSTRAINT unique_access_route_department UNIQUE (frontend_route_id, subitem_frontend_route_id, department_id);


--
-- Name: user_shift_schedule unique_user_schedule_per_day; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shift_schedule
    ADD CONSTRAINT unique_user_schedule_per_day UNIQUE (user_id, "workDate");


--
-- Name: attendance unique_user_shift_workdate; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT unique_user_shift_workdate UNIQUE (user_id, shift_id, "workDate");


--
-- Name: user_branch user_branch_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_branch
    ADD CONSTRAINT user_branch_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_profile user_profile_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_email_key UNIQUE (email);


--
-- Name: user_profile user_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_pkey PRIMARY KEY (id);


--
-- Name: user_shift_schedule user_shift_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shift_schedule
    ADD CONSTRAINT user_shift_schedule_pkey PRIMARY KEY (id);


--
-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: vector_face vector_face_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vector_face
    ADD CONSTRAINT vector_face_pkey PRIMARY KEY (id);


--
-- Name: vector_face vector_face_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vector_face
    ADD CONSTRAINT vector_face_user_id_key UNIQUE (user_id);


--
-- Name: work_schedule work_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT work_schedule_pkey PRIMARY KEY (id);


--
-- Name: attendance_shift_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_shift_id ON public.attendance USING btree (shift_id);


--
-- Name: attendance_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_status ON public.attendance USING btree (status);


--
-- Name: attendance_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_user_id ON public.attendance USING btree (user_id);


--
-- Name: attendance_work_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_work_date ON public.attendance USING btree ("workDate");


--
-- Name: access_route_department access_route_department_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_route_department
    ADD CONSTRAINT access_route_department_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: access_route_department access_route_department_frontend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_route_department
    ADD CONSTRAINT access_route_department_frontend_route_id_fkey FOREIGN KEY (frontend_route_id) REFERENCES public.frontend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: access_route_department access_route_department_subitem_frontend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_route_department
    ADD CONSTRAINT access_route_department_subitem_frontend_route_id_fkey FOREIGN KEY (subitem_frontend_route_id) REFERENCES public.subitem_frontend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance attendance_shift_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shift(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: face_attendance_check_in face_attendance_check_in_attendance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.face_attendance_check_in
    ADD CONSTRAINT face_attendance_check_in_attendance_id_fkey FOREIGN KEY (attendance_id) REFERENCES public.attendance(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: face_attendance_check_out face_attendance_check_out_attendance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.face_attendance_check_out
    ADD CONSTRAINT face_attendance_check_out_attendance_id_fkey FOREIGN KEY (attendance_id) REFERENCES public.attendance(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: frontend_backend frontend_backend_backend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.frontend_backend
    ADD CONSTRAINT frontend_backend_backend_route_id_fkey FOREIGN KEY (backend_route_id) REFERENCES public.backend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: frontend_backend frontend_backend_frontend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.frontend_backend
    ADD CONSTRAINT frontend_backend_frontend_route_id_fkey FOREIGN KEY (frontend_route_id) REFERENCES public.frontend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: frontend_subitem frontend_subitem_frontend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.frontend_subitem
    ADD CONSTRAINT frontend_subitem_frontend_route_id_fkey FOREIGN KEY (frontend_route_id) REFERENCES public.frontend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: frontend_subitem frontend_subitem_subitem_frontend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.frontend_subitem
    ADD CONSTRAINT frontend_subitem_subitem_frontend_route_id_fkey FOREIGN KEY (subitem_frontend_route_id) REFERENCES public.subitem_frontend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: holiday holiday_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holiday
    ADD CONSTRAINT holiday_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(id) ON DELETE CASCADE;


--
-- Name: permissions permissions_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public."user"(id);


--
-- Name: permissions permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subitem_frontend_backend subitem_frontend_backend_backend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subitem_frontend_backend
    ADD CONSTRAINT subitem_frontend_backend_backend_route_id_fkey FOREIGN KEY (backend_route_id) REFERENCES public.backend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subitem_frontend_backend subitem_frontend_backend_subitem_frontend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subitem_frontend_backend
    ADD CONSTRAINT subitem_frontend_backend_subitem_frontend_route_id_fkey FOREIGN KEY (subitem_frontend_route_id) REFERENCES public.subitem_frontend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subitem_frontend_route subitem_frontend_route_child_of_frontend_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subitem_frontend_route
    ADD CONSTRAINT subitem_frontend_route_child_of_frontend_route_id_fkey FOREIGN KEY (child_of_frontend_route_id) REFERENCES public.frontend_route(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_branch user_branch_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_branch
    ADD CONSTRAINT user_branch_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_branch user_branch_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_branch
    ADD CONSTRAINT user_branch_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profile user_profile_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profile user_profile_shift_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shift(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_profile user_profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_shift_schedule user_shift_schedule_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shift_schedule
    ADD CONSTRAINT user_shift_schedule_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: vector_face vector_face_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vector_face
    ADD CONSTRAINT vector_face_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_schedule work_schedule_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT work_schedule_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


