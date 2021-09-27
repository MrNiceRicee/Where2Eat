SET default_table_access_method = heap;

CREATE TABLE public."Restaurants" (
    _id character varying(255) NOT NULL,
    name character varying(255),
    image_url character varying,
    location json,
    category text[],
    price character varying,
    rating numeric DEFAULT 0,
    review_count integer DEFAULT 0
);

CREATE TABLE public."Users" (
    _id bigint NOT NULL,
    name character varying UNIQUE NOT NULL,
    total_visits integer DEFAULT 0,
    total_visited_restaurants integer DEFAULT 0,
    spent numeric DEFAULT 0
);

CREATE TABLE public."Visits" (
    _id bigint NOT NULL,
    user_id integer NOT NULL,
    restaurant_id character varying(255),
    name character varying(255),
    image_url text,
    spent numeric DEFAULT 0,
    visited_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public."Users__id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public."Visit__id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY public."Users" ALTER COLUMN _id SET DEFAULT nextval('public."Users__id_seq"'::regclass);

ALTER TABLE ONLY public."Visits" ALTER COLUMN _id SET DEFAULT nextval('public."Visit__id_seq"'::regclass);

ALTER TABLE ONLY public."Restaurants"
    ADD CONSTRAINT "Restaurants_pkey" PRIMARY KEY (_id);

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (_id);

ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT "Visit_pkey" PRIMARY KEY (_id);

