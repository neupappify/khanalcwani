import type { ReactElement } from "react";

type SchemaScriptProps = {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function SchemaScript({ schema }: SchemaScriptProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return schemas.map(
    (item, index): ReactElement => (
      <script
        key={index}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(item),
        }}
      />
    )
  );
}
