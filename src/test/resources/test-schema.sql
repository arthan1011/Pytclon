--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: _test; Type: TABLE; Schema: public; Owner: jboss; Tablespace:
--
DROP TABLE IF EXISTS _test;
CREATE TABLE IF NOT EXISTS _test (id integer NOT NULL);


ALTER TABLE _test OWNER TO jboss;

--
-- Name: id_pk; Type: CONSTRAINT; Schema: public; Owner: jboss; Tablespace:
--

ALTER TABLE ONLY _test
ADD CONSTRAINT id_pk PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

