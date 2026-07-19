import assert from 'node:assert/strict';
import test from 'node:test';

const zero = '00'.repeat(32);
const active = (fingerprint) => ({ active: true, fingerprint });
const inactive = () => ({ active: false, fingerprint: zero });

function proveModel({ currentVersion, expectedVersion, registry, parties, usedProposals, usedNonces, proposal, nonce }) {
  assert.equal(expectedVersion, currentVersion, 'stale registry version');
  assert(!usedProposals.has(proposal), 'proposal replay');
  assert(!usedNonces.has(nonce), 'nonce replay');
  assert(registry[0].active, 'registry cannot be empty');
  assert(parties[0].active, 'engagement cannot be empty');
  for (const slot of [...registry, ...parties]) {
    assert.equal(slot.active || slot.fingerprint === zero, true, 'inactive slot must be zero');
    assert.equal(!slot.active || slot.fingerprint !== zero, true, 'active slot cannot be zero');
  }
  for (const registrySlot of registry) {
    for (const partySlot of parties) {
      assert.equal(
        !registrySlot.active || !partySlot.active || registrySlot.fingerprint !== partySlot.fingerprint,
        true,
        'private conflict detected',
      );
    }
  }
  usedProposals.add(proposal);
  usedNonces.add(nonce);
}

const fp = (n) => n.toString(16).padStart(64, '0');
const registry = [active(fp(1)), active(fp(2)), ...Array.from({ length: 6 }, inactive)];

test('clean engagement finalizes and consumes both replay keys', () => {
  const usedProposals = new Set();
  const usedNonces = new Set();
  proveModel({
    currentVersion: 7,
    expectedVersion: 7,
    registry,
    parties: [active(fp(3)), ...Array.from({ length: 3 }, inactive)],
    usedProposals,
    usedNonces,
    proposal: fp(90),
    nonce: fp(91),
  });
  assert(usedProposals.has(fp(90)));
  assert(usedNonces.has(fp(91)));
});

test('a hidden matching fingerprint is rejected', () => {
  assert.throws(() => proveModel({
    currentVersion: 7,
    expectedVersion: 7,
    registry,
    parties: [active(fp(2)), ...Array.from({ length: 3 }, inactive)],
    usedProposals: new Set(),
    usedNonces: new Set(),
    proposal: fp(92),
    nonce: fp(93),
  }), /private conflict detected/);
});

test('stale registry, proposal replay, and nonce replay are independently rejected', () => {
  const common = {
    currentVersion: 8,
    registry,
    parties: [active(fp(4)), ...Array.from({ length: 3 }, inactive)],
  };
  assert.throws(() => proveModel({ ...common, expectedVersion: 7, usedProposals: new Set(), usedNonces: new Set(), proposal: fp(94), nonce: fp(95) }), /stale/);
  assert.throws(() => proveModel({ ...common, expectedVersion: 8, usedProposals: new Set([fp(94)]), usedNonces: new Set(), proposal: fp(94), nonce: fp(95) }), /proposal replay/);
  assert.throws(() => proveModel({ ...common, expectedVersion: 8, usedProposals: new Set(), usedNonces: new Set([fp(95)]), proposal: fp(94), nonce: fp(95) }), /nonce replay/);
});

test('non-canonical inactive slots are rejected', () => {
  const badRegistry = [...registry];
  badRegistry[7] = { active: false, fingerprint: fp(99) };
  assert.throws(() => proveModel({
    currentVersion: 1,
    expectedVersion: 1,
    registry: badRegistry,
    parties: [active(fp(4)), ...Array.from({ length: 3 }, inactive)],
    usedProposals: new Set(),
    usedNonces: new Set(),
    proposal: fp(96),
    nonce: fp(97),
  }), /inactive slot must be zero/);
});
