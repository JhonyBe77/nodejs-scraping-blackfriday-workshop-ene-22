CREATE TABLE "usuarios" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR,
  "email" VARCHAR UNIQUE,
  "password" VARCHAR,
  "rol" VARCHAR
);

CREATE TABLE "monturas" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR,
  "precio" DECIMAL,
  "img" VARCHAR,
  "color" VARCHAR,
  "descripcion" VARCHAR
);

CREATE TABLE "citas" (
  "id" SERIAL PRIMARY KEY,
  "id_user" INT,
  "fecha" TIMESTAMP,
  "estado" VARCHAR,
  "fecha_creacion" TIMESTAMP,
  "fecha_actualizacion" TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY ("id_user") REFERENCES "usuarios" ("id")
);

CREATE TABLE "favoritos" (
  "id" SERIAL PRIMARY KEY,
  "id_user" INT,
  "id_montura" INT,
  "fecha_creacion" TIMESTAMP,
  CONSTRAINT fk_user_favorito FOREIGN KEY ("id_user") REFERENCES "usuarios" ("id"),
  CONSTRAINT fk_montura FOREIGN KEY ("id_montura") REFERENCES "monturas" ("id")
);
