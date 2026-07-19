import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { generateClearanceV1Vector } from "./generate-vectors.ts";

test("clearance-v1 committed golden vector cannot drift", async () => {
  const path = fileURLToPath(new URL("../test-vectors/clearance-v1.json", import.meta.url));
  const committed = JSON.parse(await readFile(path, "utf8"));
  assert.deepEqual(await generateClearanceV1Vector(), committed);
});
