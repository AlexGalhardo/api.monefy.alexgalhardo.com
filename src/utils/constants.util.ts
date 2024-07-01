export const using_database = Bun.env.USE_JSON_DATABASE === "true" ? "JSON" : "PostgreSQL";
