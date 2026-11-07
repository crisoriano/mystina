import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articulos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articulos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_mundos_tema" AS ENUM('rosa', 'melocoton', 'granate', 'oscuro');
  CREATE TYPE "public"."enum_productos_tipo" AS ENUM('afiliado', 'propio');
  CREATE TABLE "articulos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"slug" varchar,
  	"mundo_id" integer,
  	"subtema" varchar,
  	"fecha_publicacion" timestamp(3) with time zone,
  	"destacado" boolean,
  	"portada_id" integer,
  	"entradilla" varchar,
  	"contenido" jsonb,
  	"seo_titulo" varchar,
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articulos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articulos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"productos_id" integer
  );
  
  CREATE TABLE "_articulos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_slug" varchar,
  	"version_mundo_id" integer,
  	"version_subtema" varchar,
  	"version_fecha_publicacion" timestamp(3) with time zone,
  	"version_destacado" boolean,
  	"version_portada_id" integer,
  	"version_entradilla" varchar,
  	"version_contenido" jsonb,
  	"version_seo_titulo" varchar,
  	"version_seo_descripcion" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articulos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_articulos_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"productos_id" integer
  );
  
  CREATE TABLE "mundos_subtemas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL
  );
  
  CREATE TABLE "mundos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"nombre_corto" varchar,
  	"slug" varchar,
  	"orden" numeric DEFAULT 1,
  	"tema" "enum_mundos_tema" DEFAULT 'rosa' NOT NULL,
  	"frase" varchar,
  	"descripcion" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "productos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"tipo" "enum_productos_tipo" DEFAULT 'afiliado' NOT NULL,
  	"destacado" boolean,
  	"imagen_id" integer,
  	"descripcion" varchar,
  	"tienda" varchar,
  	"url" varchar NOT NULL,
  	"precio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "productos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"mundos_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articulos_id" integer,
  	"mundos_id" integer,
  	"productos_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sobre_mi" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar DEFAULT 'Mystina',
  	"foto_id" integer,
  	"presentacion" varchar,
  	"historia" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ajustes_redes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"red" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "ajustes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre_sitio" varchar DEFAULT 'Mystina blog',
  	"frase_inicio" varchar,
  	"intro_inicio" varchar,
  	"legal_titular" varchar,
  	"legal_nif" varchar,
  	"legal_email" varchar,
  	"legal_direccion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "articulos" ADD CONSTRAINT "articulos_mundo_id_mundos_id_fk" FOREIGN KEY ("mundo_id") REFERENCES "public"."mundos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articulos" ADD CONSTRAINT "articulos_portada_id_media_id_fk" FOREIGN KEY ("portada_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articulos_rels" ADD CONSTRAINT "articulos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articulos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articulos_rels" ADD CONSTRAINT "articulos_rels_productos_fk" FOREIGN KEY ("productos_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articulos_v" ADD CONSTRAINT "_articulos_v_parent_id_articulos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articulos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articulos_v" ADD CONSTRAINT "_articulos_v_version_mundo_id_mundos_id_fk" FOREIGN KEY ("version_mundo_id") REFERENCES "public"."mundos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articulos_v" ADD CONSTRAINT "_articulos_v_version_portada_id_media_id_fk" FOREIGN KEY ("version_portada_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articulos_v_rels" ADD CONSTRAINT "_articulos_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articulos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articulos_v_rels" ADD CONSTRAINT "_articulos_v_rels_productos_fk" FOREIGN KEY ("productos_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mundos_subtemas" ADD CONSTRAINT "mundos_subtemas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mundos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos" ADD CONSTRAINT "productos_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos_rels" ADD CONSTRAINT "productos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos_rels" ADD CONSTRAINT "productos_rels_mundos_fk" FOREIGN KEY ("mundos_id") REFERENCES "public"."mundos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articulos_fk" FOREIGN KEY ("articulos_id") REFERENCES "public"."articulos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mundos_fk" FOREIGN KEY ("mundos_id") REFERENCES "public"."mundos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_productos_fk" FOREIGN KEY ("productos_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sobre_mi" ADD CONSTRAINT "sobre_mi_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ajustes_redes" ADD CONSTRAINT "ajustes_redes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ajustes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "articulos_slug_idx" ON "articulos" USING btree ("slug");
  CREATE INDEX "articulos_mundo_idx" ON "articulos" USING btree ("mundo_id");
  CREATE INDEX "articulos_portada_idx" ON "articulos" USING btree ("portada_id");
  CREATE INDEX "articulos_updated_at_idx" ON "articulos" USING btree ("updated_at");
  CREATE INDEX "articulos_created_at_idx" ON "articulos" USING btree ("created_at");
  CREATE INDEX "articulos__status_idx" ON "articulos" USING btree ("_status");
  CREATE INDEX "articulos_rels_order_idx" ON "articulos_rels" USING btree ("order");
  CREATE INDEX "articulos_rels_parent_idx" ON "articulos_rels" USING btree ("parent_id");
  CREATE INDEX "articulos_rels_path_idx" ON "articulos_rels" USING btree ("path");
  CREATE INDEX "articulos_rels_productos_id_idx" ON "articulos_rels" USING btree ("productos_id");
  CREATE INDEX "_articulos_v_parent_idx" ON "_articulos_v" USING btree ("parent_id");
  CREATE INDEX "_articulos_v_version_version_slug_idx" ON "_articulos_v" USING btree ("version_slug");
  CREATE INDEX "_articulos_v_version_version_mundo_idx" ON "_articulos_v" USING btree ("version_mundo_id");
  CREATE INDEX "_articulos_v_version_version_portada_idx" ON "_articulos_v" USING btree ("version_portada_id");
  CREATE INDEX "_articulos_v_version_version_updated_at_idx" ON "_articulos_v" USING btree ("version_updated_at");
  CREATE INDEX "_articulos_v_version_version_created_at_idx" ON "_articulos_v" USING btree ("version_created_at");
  CREATE INDEX "_articulos_v_version_version__status_idx" ON "_articulos_v" USING btree ("version__status");
  CREATE INDEX "_articulos_v_created_at_idx" ON "_articulos_v" USING btree ("created_at");
  CREATE INDEX "_articulos_v_updated_at_idx" ON "_articulos_v" USING btree ("updated_at");
  CREATE INDEX "_articulos_v_latest_idx" ON "_articulos_v" USING btree ("latest");
  CREATE INDEX "_articulos_v_rels_order_idx" ON "_articulos_v_rels" USING btree ("order");
  CREATE INDEX "_articulos_v_rels_parent_idx" ON "_articulos_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articulos_v_rels_path_idx" ON "_articulos_v_rels" USING btree ("path");
  CREATE INDEX "_articulos_v_rels_productos_id_idx" ON "_articulos_v_rels" USING btree ("productos_id");
  CREATE INDEX "mundos_subtemas_order_idx" ON "mundos_subtemas" USING btree ("_order");
  CREATE INDEX "mundos_subtemas_parent_id_idx" ON "mundos_subtemas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "mundos_slug_idx" ON "mundos" USING btree ("slug");
  CREATE INDEX "mundos_updated_at_idx" ON "mundos" USING btree ("updated_at");
  CREATE INDEX "mundos_created_at_idx" ON "mundos" USING btree ("created_at");
  CREATE INDEX "productos_imagen_idx" ON "productos" USING btree ("imagen_id");
  CREATE INDEX "productos_updated_at_idx" ON "productos" USING btree ("updated_at");
  CREATE INDEX "productos_created_at_idx" ON "productos" USING btree ("created_at");
  CREATE INDEX "productos_rels_order_idx" ON "productos_rels" USING btree ("order");
  CREATE INDEX "productos_rels_parent_idx" ON "productos_rels" USING btree ("parent_id");
  CREATE INDEX "productos_rels_path_idx" ON "productos_rels" USING btree ("path");
  CREATE INDEX "productos_rels_mundos_id_idx" ON "productos_rels" USING btree ("mundos_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_articulos_id_idx" ON "payload_locked_documents_rels" USING btree ("articulos_id");
  CREATE INDEX "payload_locked_documents_rels_mundos_id_idx" ON "payload_locked_documents_rels" USING btree ("mundos_id");
  CREATE INDEX "payload_locked_documents_rels_productos_id_idx" ON "payload_locked_documents_rels" USING btree ("productos_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "sobre_mi_foto_idx" ON "sobre_mi" USING btree ("foto_id");
  CREATE INDEX "ajustes_redes_order_idx" ON "ajustes_redes" USING btree ("_order");
  CREATE INDEX "ajustes_redes_parent_id_idx" ON "ajustes_redes" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articulos" CASCADE;
  DROP TABLE "articulos_rels" CASCADE;
  DROP TABLE "_articulos_v" CASCADE;
  DROP TABLE "_articulos_v_rels" CASCADE;
  DROP TABLE "mundos_subtemas" CASCADE;
  DROP TABLE "mundos" CASCADE;
  DROP TABLE "productos" CASCADE;
  DROP TABLE "productos_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "sobre_mi" CASCADE;
  DROP TABLE "ajustes_redes" CASCADE;
  DROP TABLE "ajustes" CASCADE;
  DROP TYPE "public"."enum_articulos_status";
  DROP TYPE "public"."enum__articulos_v_version_status";
  DROP TYPE "public"."enum_mundos_tema";
  DROP TYPE "public"."enum_productos_tipo";`)
}
