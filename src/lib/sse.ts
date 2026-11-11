import "server-only";

/** Server-sent events: polls `compute` and pushes only when the JSON changes. */
export function sseResponse(
  req: Request,
  compute: () => Promise<unknown>,
  intervalMs = 1000,
): Response {
  const enc = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;
  let last = "";
  let beat = 0;

  const stream = new ReadableStream({
    start(controller) {
      const stop = () => {
        if (timer) clearInterval(timer);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      const tick = async () => {
        try {
          const data = JSON.stringify(await compute());
          if (data !== last) {
            last = data;
            controller.enqueue(enc.encode(`data: ${data}\n\n`));
            beat = 0;
          } else if (++beat >= 15) {
            controller.enqueue(enc.encode(`: ping\n\n`));
            beat = 0;
          }
        } catch {
          stop();
        }
      };
      controller.enqueue(enc.encode("retry: 2000\n\n"));
      void tick();
      timer = setInterval(tick, intervalMs);
      req.signal.addEventListener("abort", stop);
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
