-- Tablas
CREATE TABLE public.clientes (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellidos character varying(100) NOT NULL,
    fecha_nacimiento date NOT NULL,
    dni character varying(20) NOT NULL,
    nacionalidad character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    telefono character varying(20) NOT NULL,
    preferencias text
);

CREATE TABLE public.facturas (
    id integer NOT NULL,
    reserva_id integer NOT NULL,
    nombre_cliente character varying(150) NOT NULL,
    total numeric(10,2) NOT NULL,
    fecha_emision date DEFAULT CURRENT_DATE NOT NULL
);

CREATE TABLE public.habitaciones (
    id integer NOT NULL,
    numero integer NOT NULL,
    tipo character varying(30) NOT NULL,
    precio numeric(10,2) NOT NULL,
    estado character varying(30) NOT NULL,
    CONSTRAINT habitaciones_estado_check CHECK (((estado)::text = ANY ((ARRAY['Disponible'::character varying, 'Ocupada'::character varying, 'Mantenimiento'::character varying])::text[]))),
    CONSTRAINT habitaciones_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Individual'::character varying, 'Doble'::character varying, 'Suite'::character varying])::text[])))
);

CREATE TABLE public.reservas (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    habitacion_id integer NOT NULL,
    fecha_entrada date NOT NULL,
    fecha_salida date NOT NULL,
    estado character varying(10) NOT NULL,
    CONSTRAINT reservas_estado_check CHECK (((estado)::text = ANY ((ARRAY['pagado'::character varying, 'pendiente'::character varying])::text[])))
);

CREATE TABLE public.servicios (
    id integer NOT NULL,
    nombre character varying(80) NOT NULL,
    descripcion text NOT NULL,
    precio numeric(10,2) NOT NULL
);

CREATE TABLE public.servicios_reservas (
    id integer NOT NULL,
    reserva_id integer NOT NULL,
    servicio_id integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    precio_total numeric(10,2) GENERATED ALWAYS AS (((cantidad)::numeric * precio_unitario)) STORED,
    CONSTRAINT servicios_reservas_cantidad_check CHECK ((cantidad > 0))
);

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido_1 character varying(100) NOT NULL,
    apellido_2 character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    rol character varying(50) NOT NULL,
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['recepcion'::character varying, 'gerente'::character varying])::text[])))
);

-- Secuencias
CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.facturas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.habitaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.reservas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.servicios_reservas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Funciones
CREATE FUNCTION public.actualizar_estado_habitacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
    IF EXISTS (
        SELECT 1
        FROM reservas
        WHERE habitacion_id = NEW.habitacion_id
          AND estado = 'pagado'
          AND (
            (NEW.fecha_entrada BETWEEN fecha_entrada AND fecha_salida) OR
            (NEW.fecha_salida BETWEEN fecha_entrada AND fecha_salida) OR
            (fecha_entrada BETWEEN NEW.fecha_entrada AND NEW.fecha_salida) OR
            (fecha_salida BETWEEN NEW.fecha_entrada AND NEW.fecha_salida)
          )
    ) THEN
        RAISE EXCEPTION 'Las fechas de la reserva se solapan con una reserva existente para la habitación con id %', NEW.habitacion_id;
    END IF;
	
    UPDATE habitaciones
    SET estado = 'Ocupada'
    WHERE id = NEW.habitacion_id
      AND NOT EXISTS (
        SELECT 1 FROM reservas
        WHERE habitacion_id = NEW.habitacion_id
          AND estado = 'pagado'
          AND (
            (NEW.fecha_entrada BETWEEN fecha_entrada AND fecha_salida) OR
            (NEW.fecha_salida BETWEEN fecha_entrada AND fecha_salida) OR
            (fecha_entrada BETWEEN NEW.fecha_entrada AND NEW.fecha_salida) OR
            (fecha_salida BETWEEN NEW.fecha_entrada AND NEW.fecha_salida)
          )
    );

    RETURN NEW;
END;
$$;

CREATE FUNCTION public.actualizar_precio_unitario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.precio_unitario := (SELECT precio FROM servicios WHERE id = NEW.servicio_id);
    RETURN NEW;
END;
$$;

-- Triggers
CREATE TRIGGER trigger_actualizar_estado_habitacion
BEFORE INSERT ON public.reservas
FOR EACH ROW
EXECUTE FUNCTION public.actualizar_estado_habitacion();

CREATE TRIGGER trigger_actualizar_precio_unitario
BEFORE INSERT ON public.servicios_reservas
FOR EACH ROW
EXECUTE FUNCTION public.actualizar_precio_unitario();