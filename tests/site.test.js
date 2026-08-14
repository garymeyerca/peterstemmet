import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [html, css, script] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("../script.js", import.meta.url), "utf8"),
]);

test("page has complete conversion structure", () => {
  for (const id of ["services", "showreel", "about", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /Discuss your communication challenge/);
  assert.match(html, /peter@belmontparke\.co\.za/);
  assert.match(html, /data-contact-form/);

  const internalLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  internalLinks.forEach((id) => assert.match(html, new RegExp(`id="${id}"`)));
});

test("page includes baseline metadata and accessibility hooks", () => {
  assert.match(html, /<meta\s+name="description"/);
  assert.match(html, /<title>Peter Stemmet/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /assets\/peter-studio\.jpg/);
  assert.doesNotMatch(html, /wp-content\/uploads/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-controls="primary-navigation"/);
  assert.doesNotMatch(html, /alt=""/);
});

test("interactions include menu, showreel and inquiry behavior", () => {
  assert.match(script, /aria-expanded/);
  assert.match(script, /toggleAttribute\("inert"/);
  assert.match(script, /getFocusWrapTarget/);
  assert.match(script, /youtube-nocookie\.com\/embed/);
  assert.match(html, /action="mailto:peter@belmontparke\.co\.za"/);
  assert.match(html, /loading="lazy"/);
  assert.match(script, /classList\.contains\("is-active"\)/);
  assert.match(script, /buildInquiryMailto/);
  assert.match(script, /IntersectionObserver/);
});

test("responsive and reduced-motion styles are present", () => {
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.js \.reveal/);
});
