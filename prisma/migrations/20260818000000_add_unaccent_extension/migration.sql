-- Habilita a extensão unaccent do Postgres, usada para busca por nome/descrição
-- ignorando acentos (ex: "gsxs" encontra "GSX-S", "aracaju" encontra "Araçaju").
CREATE EXTENSION IF NOT EXISTS unaccent;
