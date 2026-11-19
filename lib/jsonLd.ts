// Combines several schema.org nodes into one JSON-LD document using @graph.
// A bare top-level array is valid JSON-LD, but third-party scripts on the page
// (e.g. the Meta Pixel's structured-data reader) assume every block is an
// object with an "@context" string and throw on arrays.
export function jsonLdGraph(nodes: Record<string, unknown>[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes.map(({ "@context": _context, ...node }) => node),
  });
}
