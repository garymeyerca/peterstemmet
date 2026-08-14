import assert from "node:assert/strict";
import test from "node:test";

import { buildInquiryMailto, getFocusWrapTarget } from "../interaction-logic.js";

test("mobile menu focus wraps at both boundaries", () => {
  const toggle = { id: "toggle" };
  const firstLink = { id: "first" };
  const lastLink = { id: "last" };
  const focusableElements = [toggle, firstLink, lastLink];

  assert.equal(getFocusWrapTarget(lastLink, focusableElements, false), toggle);
  assert.equal(getFocusWrapTarget(toggle, focusableElements, true), lastLink);
  assert.equal(getFocusWrapTarget(firstLink, focusableElements, false), null);
  assert.equal(getFocusWrapTarget({ id: "background" }, focusableElements, false), toggle);
});

test("inquiry mailto safely encodes message delimiters and Unicode", () => {
  const mailto = buildInquiryMailto("mailto:peter@example.com", {
    name: "A & B",
    email: "a@example.com",
    organisation: "Élan",
    service: "Media training & coaching",
    message: "First line\r\nBcc: attacker@example.com",
  });

  assert.ok(mailto.startsWith("mailto:peter@example.com?subject="));
  assert.ok(mailto.includes("Media%20training%20%26%20coaching"));
  assert.ok(mailto.includes("A%20%26%20B"));
  assert.ok(mailto.includes("%C3%89lan"));
  assert.doesNotMatch(mailto, /\r|\n/);
  assert.doesNotMatch(mailto, /&Bcc:/);
});
