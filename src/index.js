const CANONICAL_HOST = "www.railisations.com";

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch: (req: Request) => Promise<Response> } }} env
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    if (host !== CANONICAL_HOST) {
      const target = `https://${CANONICAL_HOST}${url.pathname}${url.search}`;
      return Response.redirect(target, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
