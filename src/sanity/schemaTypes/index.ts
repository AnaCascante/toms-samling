import type { SchemaTypeDefinition } from "sanity";
import { movie } from "./movie";
import { vinyl } from "./vinyl";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [movie, vinyl],
};
