

CREATE FUNCTION public.function_total_restaurants() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE public."Users"
		SET "total_visited_restaurants"=(
			SELECT COUNT(DISTINCT "restaurant_id")
			FROM public."Visits"
			WHERE public."Visits"."user_id"=public."Users"."_id"
		) + 0;
	RETURN new;
END;
$$;


--
-- TOC entry 205 (class 1255 OID 24702)
-- Name: function_total_spent(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.function_total_spent() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE public."Users"
		SET "spent"=(
			SELECT SUM(spent)
			FROM public."Visits"
			WHERE public."Visits"."user_id"=public."Users"."_id"
		) + 0;
	RETURN new;
END;
$$;


--
-- TOC entry 206 (class 1255 OID 24704)
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
			WHERE public."Visits"."user_id"=public."Users"."_id"
		) + 0;
	RETURN new;
END;
$$;


SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 24692)
-- Name: Restaurants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Restaurants" (
    _id character varying(255) NOT NULL,
    name character varying(255),
    image_url character varying,
    location json,
    category text[],
    price character varying,
    rating numeric DEFAULT 0,
    review_count integer DEFAULT 0,
    url text
);


--
-- TOC entry 201 (class 1259 OID 24667)
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    _id bigint NOT NULL,
    name character varying(255) UNIQUE NOT NULL,
    total_visits integer DEFAULT 0,
    total_visited_restaurants integer DEFAULT 0,
    spent numeric DEFAULT 0,
    budget numeric DEFAULT 0,
    budget_time character varying(255) DEFAULT 'weekly'
);


--
-- TOC entry 200 (class 1259 OID 24665)
-- Name: Users__id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Users__id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2973 (class 0 OID 0)
-- Dependencies: 200
-- Name: Users__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Users__id_seq" OWNED BY public."Users"._id;


--
-- TOC entry 203 (class 1259 OID 24681)
-- Name: Visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Visits" (
    _id bigint NOT NULL,
    user_id integer NOT NULL,
    restaurant_id character varying(255),
    spent numeric DEFAULT 0,
    visited_at date DEFAULT NOW()
);


--
-- TOC entry 202 (class 1259 OID 24679)
-- Name: Visit__id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Visit__id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2974 (class 0 OID 0)
-- Dependencies: 202
-- Name: Visit__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Visit__id_seq" OWNED BY public."Visits"._id;


--
-- TOC entry 2819 (class 2604 OID 24670)
-- Name: Users _id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users" ALTER COLUMN _id SET DEFAULT nextval('public."Users__id_seq"'::regclass);


--
-- TOC entry 2823 (class 2604 OID 24684)
-- Name: Visits _id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visits" ALTER COLUMN _id SET DEFAULT nextval('public."Visit__id_seq"'::regclass);


--
-- TOC entry 2833 (class 2606 OID 24701)
-- Name: Restaurants Restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Restaurants"
    ADD CONSTRAINT "Restaurants_pkey" PRIMARY KEY (_id);


--
-- TOC entry 2829 (class 2606 OID 24678)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (_id);


--
-- TOC entry 2831 (class 2606 OID 24691)
-- Name: Visits Visit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT "Visit_pkey" PRIMARY KEY (_id);


--
-- TOC entry 2834 (class 2620 OID 24709)
-- Name: Visits trig_total_restaurants; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trig_total_restaurants AFTER INSERT OR DELETE OR UPDATE ON public."Visits" FOR EACH ROW EXECUTE FUNCTION public.function_total_restaurants();


--
-- TOC entry 2835 (class 2620 OID 24703)
-- Name: Visits trig_total_spent; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trig_total_spent AFTER INSERT OR DELETE OR UPDATE ON public."Visits" FOR EACH ROW EXECUTE FUNCTION public.function_total_spent();


--
-- TOC entry 2836 (class 2620 OID 24705)
-- Name: Visits trig_total_visits; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trig_total_visits AFTER INSERT OR DELETE OR UPDATE ON public."Visits" FOR EACH ROW EXECUTE FUNCTION public.function_total_visits();


-- Completed on 2021-09-22 23:42:43

--
-- PostgreSQL database dump complete
--

