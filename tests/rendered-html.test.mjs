import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("schedule contains valid, unique events", async () => {
  const schedule = JSON.parse(
    await readFile(new URL("../content/schedule.json", import.meta.url), "utf8"),
  );

  assert.equal(schedule.statusOverride, "auto");
  assert.ok(schedule.events.length > 0);
  assert.equal(new Set(schedule.events.map((event) => event.id)).size, schedule.events.length);

  for (const event of schedule.events) {
    assert.ok(event.id);
    assert.ok(event.title);
    assert.ok(event.subtitle);
    assert.ok(Date.parse(event.start) < Date.parse(event.end));
    assert.match(event.youtubeUrl, /^https:\/\/www\.youtube\.com\/watch\?v=/);
  }
});

test("renders the Open Global Sports home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Open Global Sports - Live international sport<\/title>/i);
  assert.match(html, /Open Global Sports/i);
  assert.match(html, /Previous broadcasts/i);
  assert.match(html, /Watch them\./i);
  assert.match(html, /On demand\./i);
  assert.match(html, /youtube\.com\/watch\?v=LaM8j-P6xXc/i);
  assert.match(html, /youtube\.com\/watch\?v=jXxvZDgw9sc/i);
  assert.doesNotMatch(html, /href="\/live"/i);
});

test("redirects the former live page to YouTube", async () => {
  const response = await render("/live");
  assert.ok(response.status >= 300 && response.status < 400);
  assert.equal(response.headers.get("location"), "https://www.youtube.com/@OpenGlobalSports");
});
