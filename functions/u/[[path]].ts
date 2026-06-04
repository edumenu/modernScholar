interface Context {
  request: Request;
  params: Record<string, string | string[]>;
}

export async function onRequest({ request, params }: Context): Promise<Response> {
  const pathParam = params.path;
  const segments = Array.isArray(pathParam)
    ? pathParam
    : pathParam
      ? [pathParam]
      : [];
  const upstream = new URL(`https://cloud.umami.is/${segments.join("/")}`);

  const incoming = new URL(request.url);
  upstream.search = incoming.search;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const clientIp = request.headers.get("cf-connecting-ip");
  if (clientIp) {
    headers.set("x-forwarded-for", clientIp);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  return fetch(upstream.toString(), {
    method: request.method,
    headers,
    body,
  });
}
