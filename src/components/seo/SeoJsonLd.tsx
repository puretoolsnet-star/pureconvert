export function SeoJsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((item, index) => (
        <script
          // eslint-disable-next-line react/no-array-index-key -- fixed-order JSON-LD blob list
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}