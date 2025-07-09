--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    full_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    verification_token text,
    has_completed_onboarding boolean DEFAULT false NOT NULL,
    profile_picture text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: waitlist_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waitlist_entries (
    id integer NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    company text DEFAULT ''::text,
    job_title text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    phone_number text NOT NULL
);


--
-- Name: waitlist_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.waitlist_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: waitlist_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.waitlist_entries_id_seq OWNED BY public.waitlist_entries.id;


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: waitlist_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist_entries ALTER COLUMN id SET DEFAULT nextval('public.waitlist_entries_id_seq'::regclass);


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, email, subject, message, created_at) FROM stdin;
1	Test Contact	test@example.com	Testing Contact Form	This is a test message to verify the contact form functionality.	2025-06-17 15:36:14.289046
2	Email Test User	ceo@contramind.com	Testing Email Functionality	This message tests the complete email workflow:\n1. Message saved to database\n2. Email sent to ContraMind team\n3. Confirmation email sent to user	2025-06-17 15:36:23.690546
3	Contact Feature Test	ceo@contramind.com	Contact Form Working Perfectly	The contact form is now fully operational with:\n- Bilingual interface (Arabic/English)\n- Email icon beside language toggle\n- Professional popup form\n- Dual email system (team notification + user confirmation)\n- Database storage for all messages	2025-06-17 15:42:15.303063
4	Website Test	test@example.com	Contact Form Verification	Testing the contact form functionality - all systems operational	2025-06-17 15:48:53.816068
5	Sarah	Sarah@Lawproxi.com	hello	hello	2025-06-17 15:53:51.94431
6	Ghhbb	ayman.a.hamdan@gmail.com	Bbbbbbh	Bhbbhhh	2025-06-18 07:02:15.526352
7	Sarah	sarah@lawproxi.com	Hello		2025-06-18 13:08:30.266388
8	Sarah	Sarah@Lawproxi.com	hello		2025-06-18 14:31:13.839193
9	Test User	test@example.com	Testing Contact Form	This is a test message to verify the contact form functionality.	2025-06-18 14:33:23.300475
10	Sarah	Sarah@Lawproxi.com	hello		2025-06-18 14:34:22.422463
11	Sarah	Sarah@Lawproxi.com	hello		2025-06-18 14:35:28.718574
12	John Doe	john.doe@example.com	Email Test - Both Directions	Testing if emails are sent to both CEO and user confirmation.	2025-06-18 14:37:41.603696
13	Test Contact	test@gmail.com	Debug Email Test	Testing email functionality with detailed logging.	2025-06-18 14:37:48.941234
14	Email Debug Test	debug@test.com	Testing Email Service	Debugging email functionality with proper logging.	2025-06-18 14:38:25.618183
15	sarah	sarah@lawproxi.com	I have a problem to access my account		2025-06-18 14:39:01.649171
16	Debug Test User	debugtest@example.com	Email Service Debug	Testing with enhanced logging to identify email issues.	2025-06-18 14:39:12.503777
17	Real Test User	test@gmail.com	Final Email Test	Testing with a real email domain to verify both directions work.	2025-06-18 14:39:23.492342
18	Islam awad	i.awad@tahaluf.ai	Demo 	Can we have demo next week 	2025-06-20 12:16:31.757429
19					2025-07-07 15:58:01.776707
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
rsAM2DYxnRAzkjlx-nrtuiTlz3M_4aWU	{"cookie":{"originalMaxAge":86400000,"expires":"2025-07-09T16:54:43.799Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":30}}	2025-07-09 16:54:46
MaxbQS6yWHUrZsPmtLZzB-Z8Q_7l6_Vb	{"cookie":{"originalMaxAge":86400000,"expires":"2025-07-09T16:16:46.411Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":30}}	2025-07-09 16:16:48
L5yNK9kHoJ0gUCnAADVmAK_8BpJDzbJP	{"cookie":{"originalMaxAge":86400000,"expires":"2025-07-09T16:58:39.442Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":30}}	2025-07-09 16:58:41
GZmnyRQTljnjJIxzW2H1F9WJMmVztW9z	{"cookie":{"originalMaxAge":86400000,"expires":"2025-07-09T15:01:54.835Z","secure":true,"httpOnly":true,"path":"/","sameSite":"none"}}	2025-07-09 15:01:56
h8Ak-5n8x212u3Rq5886pQyOul-OoRDw	{"cookie":{"originalMaxAge":86400000,"expires":"2025-07-09T17:12:07.940Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"passport":{"user":30}}	2025-07-09 17:12:10
mw0KVg_M6R9e31_2E7gx1nQZ4ZT58O1m	{"cookie":{"originalMaxAge":86400000,"expires":"2025-07-09T15:17:52.083Z","secure":true,"httpOnly":true,"path":"/","sameSite":"none"},"passport":{"user":30}}	2025-07-09 15:21:52
6-UJ5aHrrsTEOPmPlqJ5kkaXF8ZkgRiI	{"cookie":{"originalMaxAge":86400000,"expires":"2025-07-09T13:46:24.391Z","secure":true,"httpOnly":true,"path":"/","sameSite":"none"},"passport":{"user":24}}	2025-07-09 18:02:56
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password, email, full_name, created_at, email_verified, verification_token, has_completed_onboarding, profile_picture) FROM stdin;
35	Sarah@contramind.ai	Try@12345	Sarah@contramind.ai	Sarah	2025-07-08 18:20:58.226138	f	5ba1219a4818894d5cbd3c56e059eda2a624a076fd6e1f1784e7b2b6e6102003	f	\N
36	sarah@contramind.ai	oauth_microsoft_afc3a813-4992-4edd-8fd2-5fdaf42a39af	sarah@contramind.ai	Sarah Hassan	2025-07-08 18:25:41.498496	t	\N	f	\N
37	ayman.hamdan.us@gmail.com	oauth_google_113913197690425164115	ayman.hamdan.us@gmail.com	Ayman Hamdan	2025-07-08 18:59:10.140921	t	\N	f	\N
38	consult@ayman.ws	nkQnWX9&38b@$gFH#Fg%	consult@ayman.ws	ayman hamdan	2025-07-08 19:09:12.575093	f	f977c9509a9e03c2ce27c5c574a1bc455e5bcfd7704db7a2769d93602b174ba0	f	\N
39	worktaher_4@hotmail.com	T@hmed_011	worktaher_4@hotmail.com	taher ahmed ahmed mostafa	2025-07-09 05:37:32.422434	f	935b208928a0aa42c20be12728412359d2acd12fff4014967c68af3aa6a29f0a	f	\N
33	Sarahassan010200@gmail.com	Try@12345	Sarahassan010200@gmail.com	Sarah	2025-07-08 18:05:52.591812	f	131ead3148b70c38e5dc4ece9d40480d7da33a2526d5bff3efccece75541e9ce	f	\N
34	ceo@contramind.com	oauth_google_108786774390845429101	ceo@contramind.com	CEO of ContraMind	2025-07-08 18:12:52.014203	t	\N	f	\N
\.


--
-- Data for Name: waitlist_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.waitlist_entries (id, full_name, email, company, job_title, created_at, phone_number) FROM stdin;
2	Ahmed Al-Rashid	ahmed@example.com	Tech Solutions	Legal Director	2025-06-15 18:10:03.591324	
3	سارة محمد	sara@example.com	شركة التقنية المتقدمة	مدير قانوني	2025-06-15 18:15:07.281796	
4	Ayman Hamdan	ayman.hamdan.us@gmail.com	Unifonic	CEO	2025-06-15 18:38:13.563488	
5	Sarah	Sarah@contramind.com	contramind	R&D	2025-06-15 19:22:02.631912	
6	sarah	sarah@contramind.com	contramind	lawyer	2025-06-15 19:25:03.705167	
7	Sarah	Sarah@Lawproxi.com	Lawproxi	lawyer	2025-06-15 19:28:53.560198	
8	Sarah	Sarah@lawproxi.com	LawProxi	Lawyer	2025-06-15 19:49:48.722583	
9	Ayman Hamdan	ayman@unifonic.com	Unifonic	VP shared services 	2025-06-17 10:07:03.514424	
10	Test User	test@example.com	Test Company	Test Position	2025-06-17 12:35:30.115202	
11	sarah	sarah@lawproxi.com	lawproxi	lawyer	2025-06-17 12:38:59.879547	
12	sarah	Sarah@contramind.ai	Contramind	R&D	2025-06-17 12:40:52.210894	
13	Test User	test@gmail.com	Test Company	Test Position	2025-06-17 12:45:18.247737	
14	John Doe	ceo@contramind.com	ContraMind	CEO	2025-06-17 12:45:53.195785	
15	Domain Verification Test	domaintest@example.com	Test Company	Test Position	2025-06-17 13:07:59.999334	
16	Email Test User	emailtest2024@gmail.com	Test Company	Test Position	2025-06-17 13:10:39.904448	
17	Domain Test	verification@gmail.com	Test Co	Tester	2025-06-17 14:26:27.47656	
18	DNS Test User	testdns2024@gmail.com	Test Company	DNS Tester	2025-06-17 14:35:16.439998	
19	Test Working Email	workingemail2024@gmail.com	Test Co	Tester	2025-06-17 14:54:19.242724	
20	Email System Test	emailsystemtest@gmail.com	Test Company	System Tester	2025-06-17 14:59:26.499208	
21	Domain Success Test	domainverified@example.com	Test Company	Verification Tester	2025-06-17 15:09:11.426962	
22	Sarah	sarahassan010200@gmail.com	contramind	Lawyer	2025-06-17 15:17:23.978537	
23	sarah	sarah@contramind.ai	contramind	R&D	2025-06-17 15:28:01.72215	
24	ساره	shassan8876@gmail.com	contramind	R&D	2025-06-17 20:16:02.133294	01020038793
25	Bbbbbb	ayman.a.hamdan@gmail.com	Bbbbb	Vvvvv	2025-06-18 07:04:19.130435	+966506652153
26	Ayman Hamdan	consult@ayman.ws	Unifonic	CEO of UnifonicX	2025-06-18 07:05:11.616959	506652153
27	Sarah	Sarahassan010200@gmail.com	LawProxi	Lawyer	2025-06-18 07:08:05.632243	01020038793
28	Sarah	dba.hult@ayman.ws	Contramind	Lawyer	2025-06-18 07:15:36.488186	01020038793
29	Hashem Alfadhli 	Hashempro26@gmail.com	ARKAN LEGAL CONSULTANT 	Trainee 	2025-06-18 09:17:01.578271	+96565905454
30	Mariam Al Biltagy	mariamalbiltagy@gmail.com	Abdallah & Abu El Naga Legal Advisors	Lawyer	2025-06-18 10:35:29.583931	+201009962831
31	Ahmed Mohammed Abdelsalam	ahsalam29@gmail.com	The National Authority For Social Insurance	محام 	2025-06-18 10:58:25.710768	+201033508777
32	mahmoud mohi	m-aboshady@omanilawfirm.com	omani lawfirm	legal counsel 	2025-06-18 11:00:50.886645	+97466063385
33	Basel Ali Hamed	basel_ali@efinance.com.eg	efinance 	Lawyer 	2025-06-18 11:06:45.950723	01012013877
34	Hamdy Hafez	hamdy.hafez@grifolsegyptplasma.com	Grifols Egypt	CLO	2025-06-18 11:26:41.46452	00201066630255
35	Mohamed Elhadad 	eng44eng@yahoo.com	دار الهندسة 	مهندس 	2025-06-18 11:35:19.424904	+966503189541
36	Ahmed ibrahim	Ahmedibrahim2026@gmail.com	Damac properties	Legal advisor 	2025-06-18 11:52:46.422162	0543580555
37	Mahmoud Abdelgawad 	info@babeladl.com	Bab Eladl - law firm	CEO 	2025-06-18 12:09:50.615752	+201000010787
38	محمد رجب السعداوي	mohamed_ragab474@yahoo.com	IHCC 		2025-06-18 12:49:45.99737	+966546102865
39	Abdel Hady Rateb	hady.rateb@gmail.com		محامى	2025-06-18 12:56:45.164692	01004148568
40	gaber ahmed gaber	mostafa_605@yahoo.com	sgh	legal advisor 	2025-06-18 13:01:31.858178	+201118258548
41	فقيه محمد مرغني 	fmmarghany@gmail.com	ميكو	مستشار قانوني 	2025-06-18 13:05:01.603332	00201555333624
42	Amr	amr@recapet.com	Recapet	CEO	2025-06-18 13:25:22.458639	+966562010365
43	Mohamed Al Essawe 	mohamedesawe40@yahoo.com	Innovation future 	Business development manager 	2025-06-18 13:41:05.7815	966583624994
44	احمد الدسوقى احمد الشافعى 	ahmed.elshafei40@gmail.com	شركة حائل الوطنية للخدمات الصحية	مستشار قانونى	2025-06-18 13:44:07.626341	00966507124174
45	ياسر الصاعدي	ii99299@gmail.com	شركة حلول و تحكم	رئيس تنفيذي	2025-06-18 13:44:21.56884	966564121721
46	Abdelrahman Fahmy	Abdulrahman.fahmy3@gmail.com	عبدالرحمن فهمي 	مستشار قانوني 	2025-06-18 14:20:36.791303	+971523369099
47	Emad Ali	emadali30@gmail.com	Middle East Healthcare Company	Lawyer	2025-06-18 14:21:21.994881	+966542108245
48	عاطف رجب محمد عوض	atefawad432@gmail.com	شركة الشرق الأوسط للرعاية الصحية	مستشار قانوني	2025-06-18 14:22:32.770658	546041555
49	عاطف رجب محمد عوض	atefawad821@yahoo.com	شركة الشرق الأوسط للرعاية الصحية	مستشار قانوني	2025-06-18 14:25:53.500485	00966546041555
50	مصطفى عبد الشهيد خضر 	la2.jed@bmc.edu.sa	كلية البترجي الطبية 	مستشار قانوني 	2025-06-18 14:27:55.447995	00966540545857
51	Raed Gassas 	r.gassas@proecho.sa	Pro Echo	CEO	2025-06-18 14:41:44.4402	+966566755550
52	Ahmed Abdelrahim	ahmdabdrhim@gmail.com	CALO	Lawyer	2025-06-18 14:43:15.54678	+201007114478
53	Saeed abdelaziz mahmoud	avocatesaidmahmoud@gmail.com	Speed	Legal advisor 	2025-06-18 14:46:37.718313	+201099912585
54	Khaled Mohammed Elnaggar	la15.sghg@sghgroup.net	Saudi German Hospital Madinah	Legal Advisor	2025-06-18 14:47:22.676485	00966550062644
55	Aly Hassan Farag	alyhasanfarag@gmail.com	Hassan Farag Law Office	Junior Associate	2025-06-18 15:13:02.28118	+201552484802
56	Alaa Hegazy	alaahegazi@gmail.com		Contracts Manager	2025-06-18 15:25:57.991023	+966599586500
57	Ashraf Al Debai	ashraf_walid@hotmail.com	Wfrlee.com	Founder & CEO	2025-06-18 15:55:13.514072	+966 567855553
58	Hossam Gramon	hossam.gramon@adsero.me	Adsero	Partner	2025-06-18 16:05:20.448974	01006667826
59	HAITHAM ELMANSI	eng.hythamelmansy@gmail.com	PARSONS	Contract manager 	2025-06-18 16:41:03.306327	+966594249056
60	Sultan Salem	sultan645@hotmail.com			2025-06-18 17:54:28.376078	+966503373338
61	BARAA Almousa	bara.mosa@gmail.com			2025-06-18 18:16:30.0499	0543430913
62	Amr Rabie 	amr-elmanakhly@outlook.com		Legal Director 	2025-06-18 18:23:20.528246	+00201116663131
63	Aysha alhosani	aisha.alhosani88@hotmail.com	مستشفى السعودي الالماني	مدير شؤون قانونية	2025-06-18 19:34:11.261403	971568453331
64	Mohamed suliman	mohamed.hamdy.suliman@gmail.com		Judge 	2025-06-18 21:21:34.337878	00201095653257
65	Salah Moustafa 	salah@valors.agency	Valor’s Advertising Services FZE	Founder	2025-06-18 21:48:54.14812	+971509116515
66	Enas Hegazi 	enashegazi12@gmail.com	No	Finance Manager 	2025-06-18 23:48:02.063359	00905511759376
67	Omar Mahmoud ElDeweny	eldewenyo@gmail.com	Sameh Ashour & Ahmed Amin Law Firm	Corporate Lawyer	2025-06-19 02:44:31.741267	+201003123700
68	Omymah 	Omymah@rafah.tech	Rafah AI	CEO	2025-06-19 04:56:51.744554	+966555055555
69	Amr Reda Abd El Latif	amr.reda.abdulatif@gmail.com	Hassan Allam Holding	Regional Legal Counsel	2025-06-19 06:00:17.320188	+201101101284
70	Abdulrhman Al Abdullateef 	labstation.sa@gmail.com	Lab Station 	CEO	2025-06-19 06:45:15.730766	+966506845069
71	محمد الإمام علي إبراهيم	melemam103@gmail.com		مستشار قانوني	2025-06-19 08:30:19.517544	+971564085287
72	Hossameldin Saad	Hossiii58@gmail.com	Flutterwave 	General Counsel 	2025-06-19 09:22:26.585886	+971556914869
73	حسن علي البشار	hassan.albashar.gafi@gmail.com	فرد	مستشار قانوني	2025-06-19 09:35:36.159072	0549721245
74	sam thabet	swordbright76@gmail.com			2025-06-19 10:22:28.817474	01207895540
75	Raed Alharbi	RaedHarbi15@gmail.com	NA	NA	2025-06-19 10:33:32.460653	966595188991
76	Motaz najdawi	motaz.najdawi1987@gmail.com		محامي	2025-06-19 11:00:30.619895	00962795866165
77	Ahmed Hassan Mohamed Eltawil 	ahmedaltawil1234@gmail.com	الشرق الأوسط 	مستشار قانوني 	2025-06-19 11:16:10.69763	00966543772906
78	hala elbahr	halaabdelal71@gmail.com	STATEMANTES FOR CONSULTING	Corporate  lawyer 	2025-06-19 11:38:33.026946	+201150562809
79	Mohamed Diab	mohamednabil.diab@gmail.com		Legal Counsel	2025-06-19 11:54:19.110612	01020515081
80	Mahmoud Abdalraziq 	mahmoud.abdalraziq@outlook.com	Egyptian Bar Association - Self Employed	Bilingual Legal counsel & Contracts Specialist 	2025-06-19 12:14:09.869229	+201019355305
81	Ehab Mohamed	ehab.a.elhafiez@gmail.com	GAFI	Legal Advisor	2025-06-19 13:14:07.202071	+201004348412
82	Sarah Shaheen	khaledsara87@gmail.com	Sahl law firm	Legal consultant 	2025-06-19 14:30:18.804761	00201116433202
83	Noura	nora1234nora@hotmail.com	Law firm	Lawyer	2025-06-20 05:08:15.066795	541836655
84	ماجد جمعان سالم 	he-@msn.com	موظف	رئيس قسم الشؤون القانونية	2025-06-20 09:19:58.314696	+971555560009
85	jehad ali al-tamimi	lawyerjehadali@gmail.com	Jehad Ali	Lawyer	2025-06-20 12:04:28.557576	07816066379
86	Ali Ahmed Ali Abdallah 	aliabdallah91999@gamil.com		محامي حر 	2025-06-21 06:22:59.617407	#201125244888
87	Ahmad Zughaer	ahmadzughaer@gmail.com	Qualytaste	CEO	2025-06-21 09:54:11.063491	0597328387
88	Doaa shendy	doaashendy@gmail.com	Ibnsina pharma	Contracting manager	2025-06-21 10:50:54.026379	+201002981555
89	Mohammed Almarhoon	m99ali@gmail.com	Rebhan	Founder	2025-06-21 16:05:15.55256	0554225647
90	Hend Maher	hend30591@gmail.com	Manon	Lawyer 	2025-06-21 17:12:02.014476	+966366258
91	Majed Mohd	majedpod@gmail.com	MEDAN	GM	2025-06-21 19:32:40.878782	+966544557788
92	Youssef Welily	youssef.welily@gmail.com	Badr & Associates	Lawyer	2025-06-22 10:55:46.604439	+201148154010
93	Deyaa Eldin 	deyaa.hakim@gmail.com	Sahl	advisor	2025-06-22 12:32:01.942029	00201111181301
94	احمد سيف علوان	Ahmedseif281@gmail.com	Elwan&partners 	محام، مستشار قانوني	2025-06-23 08:14:12.458079	01094415222
95	Mohammad Bukhamsin	mohammed@swarmrobotics.io	Swarm Robotics 	CEO	2025-06-23 14:14:32.845646	+966564985085
96	بيان عبد العزيز باشيخ 	Bayan.Basheikh@gmail.com	Studio Beno	رائدة عمل 	2025-06-23 14:31:27.857298	0583457000
97	Shehab 	Shehab.ElSalamony@gmail.com	Egyptian Public Prosecution 	Legal expert	2025-06-23 23:12:49.672882	+3358975824
98	Mostafa Fayez El-Sayed Mostafa 	mostafafayez0897@gmail.com	Wadina Group 	Corporate Lawyer 	2025-06-24 07:24:27.280166	+201273663970
99	Ragab Saeed Adam Mahmoud	ragabjr1121@gmail.com	ragab AI	Trader	2025-06-24 08:05:47.901361	+249964234040
100	Mazen alharbi	mazen3084@gmail.com	Acc	Legal experts 	2025-06-24 08:15:17.428538	0580011000
101	يلمان عتقه المحمدي	salmanalmohammdi@gmail.com			2025-06-25 08:02:17.283386	9665553655509
102	Anas Alsulaiman	anasals996@gmail.com	Mudad	Legal & Governance specialist 	2025-06-25 16:37:29.523561	0582968885
103	Amr Badawy	amr@reactalabs.com	Reacta Labs	CEO	2025-06-25 16:40:07.544969	+201288727776
104	Faisal elkady	faisal.elkadio@gmail.com	Yakathoon ltd	General manager and procurement consultant	2025-06-25 17:46:37.197764	+966561655664
105	Abdullah Alshamrani 	abdullah@shpl.sa	SHPL LAW	Lawyer 	2025-06-25 18:26:02.922186	+966506326900
106	Wessam Mohsen Abulfadl	Wesamonsen@gmail.com	DAGHER IP	Legal Consultant 	2025-06-25 20:52:39.259577	+201110583997
107	Osama AlRaee	osama@lendo.sa	Lendo	CEO	2025-06-26 15:37:22.983918	+966558888541
108	Reda Alhamed	reda@sedco.co	SEDCO	Professional Services Manager	2025-06-27 09:03:48.413745	+966500384627
109	Mohamed Awad	mohamed.rabea.awad@gmail.com	Bureau Veritas 	Lawyer 	2025-06-27 17:16:58.806566	+97433185920
110	عبدالملك قشقري 	am.gashgari@gmail.com	المياه	مدير الخدمات المشتركة 	2025-06-29 08:29:58.97964	966580800082
111	Ali Abuharb	ali.i.abuharb@gmail.com	Private	CEO	2025-06-30 02:14:45.015562	+966541211120
112	Usama nasr	usnasr1@gmail.com	Botawy	Founder	2025-06-30 05:16:24.485073	01274664407
113	‪Ezz-Eldin Osama Ali Salah Eldin 	ezzosama02@gmail.com	Link Aero Trading Agency 	مستشار عقود ومشتريات	2025-06-30 06:31:08.965754	01020637877
114	محمود ماهر عبدالمنعم	Mahmoudmaher2993@yahoo.com	الماهر للدعم القانوني	محامي	2025-06-30 10:01:29.862209	+201141246560
115	BAMBA Moustapha	bamba723@gmail.com	MZAD Commercial	Legal Adviser	2025-06-30 13:19:32.371556	+966509491268
116	Osama Monkith	osamamonkith@gmail.com	Manasaty.com	Founder and CEO	2025-07-01 04:19:06.744725	+962799097234
117	Mohamed Ahmd Kassab	mahamedkassab@gmail.com	Free	Arbitrator and legal researcher specialist in sports law	2025-07-01 09:13:00.198898	+201002346613
118	Amr Agwaa	me@amragwaa.com	Agwaa & Co	Lawyer	2025-07-01 10:44:15.969325	+201201150005
119	Kareem El Montaser	kareemelmontasser@gmail.com		Counsel, Corporate and Commercial Lawyer	2025-07-01 20:16:09.249854	+0201129444646
120	Mohamed mahmoud Khedr	mohamedkhedr68@gmail.com	Gamal Alghailani Law Office	Legal Consultant	2025-07-07 06:53:23.020522	+96892954845
121	Abdelmonem Abdelsalam 	abdelmonemabdelsalam@gmail.com		مدير عقود 	2025-07-08 11:38:48.222918	0249912323981
\.


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 19, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 39, true);


--
-- Name: waitlist_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.waitlist_entries_id_seq', 121, true);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: waitlist_entries waitlist_entries_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist_entries
    ADD CONSTRAINT waitlist_entries_email_unique UNIQUE (email);


--
-- Name: waitlist_entries waitlist_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist_entries
    ADD CONSTRAINT waitlist_entries_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);


--
-- PostgreSQL database dump complete
--

