export default function merge(...schemas: any) {
  const [first, ...rest] = schemas;
  const merged = rest.reduce(
    (mergedSchemas: any, schema: any) => mergedSchemas.concat(schema),
    first,
  );
  return merged;
}
