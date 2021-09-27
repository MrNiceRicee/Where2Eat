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

CREATE TRIGGER trig_total_restaurants AFTER INSERT OR DELETE OR UPDATE ON public."Visits" FOR EACH ROW EXECUTE FUNCTION public.function_total_restaurants();

CREATE TRIGGER trig_total_spent AFTER INSERT OR DELETE OR UPDATE ON public."Visits" FOR EACH ROW EXECUTE FUNCTION public.function_total_spent();

CREATE TRIGGER trig_total_visits AFTER INSERT OR DELETE OR UPDATE ON public."Visits" FOR EACH ROW EXECUTE FUNCTION public.function_total_visits();