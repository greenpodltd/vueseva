const fs = require("fs");
const path = require("path");
const { createServer: createViteServer } = require("vite");

async function createServer() {
  const fastify = require("fastify")({
    logger: true,
  });
  await fastify.register(require("fastify-express"));

  const vite = await createViteServer({
    server: { middlewareMode: "ssr" },
  });

  fastify.use(vite.middlewares);

  fastify.use("*", async (request, reply) => {
    const url = "/";

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/src/entry-server.ts");
      const [appHtml] = await render(url, {});
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);
      reply.status(200).send(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      reply.status(500).send(e.message);
    }
  });

  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

createServer();
