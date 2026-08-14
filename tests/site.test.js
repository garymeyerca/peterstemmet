import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [html, css, script] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("../script.js", import.meta.url), "utf8"),
]);

const socialShareImage = new URL("../assets/social-share.jpg", import.meta.url);

test("page has complete conversion structure", () => {
  for (const id of ["services", "showreel", "about", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /Discuss your communication challenge/);
  assert.match(html, /peter@belmontparke\.co\.za/);
  assert.match(html, /data-contact-form/);

  const internalLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  internalLinks.forEach((id) => assert.match(html, new RegExp(`id="${id}"`)));

  const showreelPosition = html.indexOf("See the experience");
  const servicesPosition = html.indexOf("Ways to work together");
  const challengePosition = html.indexOf("The real challenge");
  assert.ok(showreelPosition < servicesPosition && servicesPosition < challengePosition);
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

test("social previews use a complete branded share card", async () => {
  assert.match(html, /property="og:url" content="https:\/\/garymeyerca\.github\.io\/peterstemmet\/"/);
  assert.match(html, /property="og:site_name" content="Peter Stemmet"/);
  assert.match(html, /property="og:image"\s+content="https:\/\/garymeyerca\.github\.io\/peterstemmet\/assets\/social-share\.jpg"/s);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /property="og:image:alt"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:image"\s+content="https:\/\/garymeyerca\.github\.io\/peterstemmet\/assets\/social-share\.jpg"/s);
  assert.match(html, /name="twitter:image:alt"/);

  const image = await readFile(socialShareImage);
  assert.ok(image.length > 20_000, "social share image should contain the designed card");
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

test("about section uses the dark visual treatment", () => {
  assert.match(css, /\.about-section\s*\{[^}]*color:\s*var\(--white\);[^}]*background:\s*var\(--ink\);[^}]*\}/s);
  assert.match(css, /\.about-section \.kicker\s*\{[^}]*color:\s*#7bb1ff;[^}]*\}/s);
  assert.match(css, /\.about-copy > p:not\(\.kicker\):not\(\.lead\)\s*\{[^}]*color:\s*#a6b5c0;[^}]*\}/s);
});

test("swapped portraits retain intentional focal framing", () => {
  assert.doesNotMatch(css, /\.image-frame img\s*\{[^}]*min-height:[^}]*\}/s);
  assert.match(css, /\.about-image img\s*\{[^}]*object-position:\s*100% center;[^}]*\}/s);
});

test("hero portrait uses its native dimensions without cropping", () => {
  assert.match(css, /\.image-frame img\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto;[^}]*\}/s);
  assert.doesNotMatch(css, /\.image-frame img\s*\{[^}]*(?:aspect-ratio|object-fit|object-position):[^}]*\}/s);
  assert.doesNotMatch(css, /\.hero-visual\s*\{[^}]*width:[^}]*\}/s);
});
