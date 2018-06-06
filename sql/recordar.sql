--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.8
-- Dumped by pg_dump version 9.6.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

CREATE TABLE public.categories (
    user_id integer NOT NULL,
    cat_id character varying(10) NOT NULL,
    cat_name character varying(50) NOT NULL
);


--

CREATE TABLE public.categories_act (
    cat_id character varying(10) NOT NULL,
    type character varying(20) NOT NULL,
    content text,
    hash text,
    date character varying(30),
    user_id integer NOT NULL
);


--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(30) NOT NULL,
    password character varying(40) NOT NULL,
    email character varying(60) NOT NULL
);


--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--

COPY public.categories (user_id, cat_id, cat_name) FROM stdin;
1	AA844	Educational
1	S6683108	School
3	AH72465101	At Home
3	AS92665108	At School
15	T8884115	Tomatoes
15	E4469115	Eggs
\.


--

COPY public.categories_act (cat_id, type, content, hash, date, user_id) FROM stdin;
AA844	Annually	Annually new page at Educational	init hash	2012-12-21 12:12:12	1
S6683108	Bathroom	Bathroom new page at School\nHe he\n	Hashing hashing	2018-05-04 21:40:30	1
S6683108	School	init note of School&nbsp;<div>Yep, it is a school&nbsp;</div>	Hashing hashing	2018-04-30 21:17:23	1
T8884115	Red	Red new page at Tomatoes	init hash	2012-12-21 12:12:12	15
T8884115	Tomatoes	init note of Tomatoes\nhehhe\nthis is from pc, it sure is new	Hashing hashing	2018-05-05 22:19:09	15
E4469115	Eggs	init note of Eggs	init hash	2012-12-21 12:12:12	15
E4469115	Eggshells	Eggshells new page at Eggs	init hash	2012-12-21 12:12:12	15
E4469115	Eggplant	Eggplant new page at Eggs	init hash	2012-12-21 12:12:12	15
S6683108	Monthly	Monthly new page at School	init hash	2012-12-21 12:12:12	1
AA844	daily	Daily education\nCccc	Hashing hashing	2018-05-04 21:40:06	1
AA844	monthly	<div>changing date of monthly educational</div>	hashingorking??yeahw	2017-07-31 11:15:54	1
AH72465101	At Home	init note of At Home	init hash	2012-12-21 12:12:12	3
AH72465101	Lost	Lost at home 	Hashing hashing	2018-05-05 01:47:09	3
AS92665108	Lost	Lost new page at At School	init hash	2012-12-21 12:12:12	3
\.


--

COPY public.users (id, username, password, email) FROM stdin;
1	test1	test1	test1@gmail.com
3	test2	test2	test2@gmail.com
5	test3	test2	test3@gmail.com
6	test4	test4	test4@gmail.com
7	test5	test5	test5@gmail.com
8	test6	test6	test6@gmail.com
9	test8	test8	test8@gmail.com
12	undefined	undefined	undefined
15	1	1	1@mm.com
\.


--

SELECT pg_catalog.setval('public.users_id_seq', 15, true);


--

ALTER TABLE ONLY public.categories_act
    ADD CONSTRAINT categories_act_pkey PRIMARY KEY (cat_id, user_id, type);


--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (cat_id, user_id);


--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

