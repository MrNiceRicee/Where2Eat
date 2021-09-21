--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4 (Debian 13.4-1.pgdg100+1)
-- Dumped by pg_dump version 13.4

-- Started on 2021-09-21 02:13:55

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

DROP DATABASE where2eat;
--
-- TOC entry 2977 (class 1262 OID 24591)
-- Name: where2eat; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE where2eat WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


\connect where2eat

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
-- TOC entry 206 (class 1255 OID 24650)
-- Name: function_total_visits(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.function_total_visits() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE public."Users"
		SET "total_visits"=(
			SELECT COUNT(*)
			FROM public."Visits"
			WHERE public."Visits"."user_id"=public."Visits"."_id"
		);
	RETURN new;
END;
$$;


SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 24611)
-- Name: Restaurants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Restaurants" (
    _id bigint NOT NULL,
    name character varying(255) NOT NULL,
    image_url text,
    price character varying(20) DEFAULT '$'::character varying,
    location json,
    category text[],
    "first_visitAt" timestamp with time zone DEFAULT now(),
    "last_visitAt" timestamp with time zone DEFAULT now(),
    user_id integer NOT NULL,
    visits integer,
    ratings numeric,
    review_count integer
);


--
-- TOC entry 202 (class 1259 OID 24609)
-- Name: Restaurant__id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Restaurant__id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2978 (class 0 OID 0)
-- Dependencies: 202
-- Name: Restaurant__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Restaurant__id_seq" OWNED BY public."Restaurants"._id;


--
-- TOC entry 201 (class 1259 OID 24594)
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    _id bigint NOT NULL,
    name character varying NOT NULL,
    spent numeric,
    total_visits integer,
    total_restaurants integer
);


--
-- TOC entry 200 (class 1259 OID 24592)
-- Name: Users__id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Users__id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2979 (class 0 OID 0)
-- Dependencies: 200
-- Name: Users__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Users__id_seq" OWNED BY public."Users"._id;


--
-- TOC entry 205 (class 1259 OID 24630)
-- Name: Visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Visits" (
    _id bigint NOT NULL,
    user_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    spent numeric,
    visit_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 204 (class 1259 OID 24628)
-- Name: Visits__id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Visits__id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2980 (class 0 OID 0)
-- Dependencies: 204
-- Name: Visits__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Visits__id_seq" OWNED BY public."Visits"._id;


--
-- TOC entry 2820 (class 2604 OID 24614)
-- Name: Restaurants _id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Restaurants" ALTER COLUMN _id SET DEFAULT nextval('public."Restaurant__id_seq"'::regclass);


--
-- TOC entry 2819 (class 2604 OID 24597)
-- Name: Users _id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users" ALTER COLUMN _id SET DEFAULT nextval('public."Users__id_seq"'::regclass);


--
-- TOC entry 2824 (class 2604 OID 24633)
-- Name: Visits _id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visits" ALTER COLUMN _id SET DEFAULT nextval('public."Visits__id_seq"'::regclass);


--
-- TOC entry 2969 (class 0 OID 24611)
-- Dependencies: 203
-- Data for Name: Restaurants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Restaurants" (_id, name, image_url, price, location, category, "first_visitAt", "last_visitAt", user_id, visits, ratings, review_count) FROM stdin;
\.


--
-- TOC entry 2967 (class 0 OID 24594)
-- Dependencies: 201
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Users" (_id, name, spent, total_visits, total_restaurants) FROM stdin;
\.


--
-- TOC entry 2971 (class 0 OID 24630)
-- Dependencies: 205
-- Data for Name: Visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Visits" (_id, user_id, restaurant_id, spent, visit_at) FROM stdin;
\.


--
-- TOC entry 2981 (class 0 OID 0)
-- Dependencies: 202
-- Name: Restaurant__id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Restaurant__id_seq"', 1, false);


--
-- TOC entry 2982 (class 0 OID 0)
-- Dependencies: 200
-- Name: Users__id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Users__id_seq"', 1, false);


--
-- TOC entry 2983 (class 0 OID 0)
-- Dependencies: 204
-- Name: Visits__id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Visits__id_seq"', 1, false);


--
-- TOC entry 2829 (class 2606 OID 24622)
-- Name: Restaurants Restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Restaurants"
    ADD CONSTRAINT "Restaurant_pkey" PRIMARY KEY (_id);


--
-- TOC entry 2827 (class 2606 OID 24602)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (_id);


--
-- TOC entry 2831 (class 2606 OID 24639)
-- Name: Visits Visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT "Visits_pkey" PRIMARY KEY (_id);


--
-- TOC entry 2835 (class 2620 OID 24651)
-- Name: Visits trig_total_visits; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trig_total_visits AFTER INSERT OR DELETE OR UPDATE ON public."Visits" FOR EACH ROW EXECUTE FUNCTION public.function_total_visits();


--
-- TOC entry 2834 (class 2606 OID 24645)
-- Name: Visits restaurant_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT restaurant_id FOREIGN KEY (restaurant_id) REFERENCES public."Restaurants"(_id);


--
-- TOC entry 2832 (class 2606 OID 24623)
-- Name: Restaurants user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Restaurants"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."Users"(_id);


--
-- TOC entry 2833 (class 2606 OID 24640)
-- Name: Visits user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."Users"(_id);


-- Completed on 2021-09-21 02:13:56

--
-- PostgreSQL database dump complete
--

