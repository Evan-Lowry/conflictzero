import { FormEvent, useEffect, useMemo, useState } from 'react'
import { demoConflictService } from './service'
import type { Engagement, Receipt, RegistryEntry } from './types'

type View = 'home' | 'dashboard' | 'registry' | 'new-check' | 'receipt'
type CheckState = 'editing' | 'running' | 'cleared' | 'review' | 'error'

const seededRegistry: RegistryEntry[] = [
  { id: 'r1', name: 'Northstar Group', role: 'Active client', added: 'Jun 03, 2026' },
  { id: 'r2', name: 'Meridian Holdings', role: 'Former client', added: 'May 22, 2026' },
  { id: 'r3', name: 'Lumen BioSystems', role: 'Restricted party', added: 'Apr 14, 2026' },
  { id: 'r4', name: 'Atlas Shore Energy', role: 'Counterparty', added: 'Mar 29, 2026' },
]

const proofStages = [
  { number: '01', label: 'Normalize', detail: 'Convert confirmed organizations into exact canonical identifiers.' },
  { number: '02', label: 'Fingerprint', detail: 'Generate Compact fingerprints inside the private witness.' },
  { number: '03', label: 'Compare 32 pairs', detail: 'Check 4 engagement slots against 8 protected registry slots.' },
  { number: '04', label: 'Bind proof', detail: 'Bind firm, registry version, engagement digest, and one-time nonce.' },
  { number: '05', label: 'Publication gate', detail: 'Publish a receipt only if every private comparison is clear.' },
]

function App() {
  const [view, setView] = useState<View>('home')
  const [registry, setRegistry] = useState(seededRegistry)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [demoBanner, setDemoBanner] = useState(true)

  const navigate = (next: View) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <Header navigate={navigate} />
      {demoBanner && (
        <div className="demo-banner">
          <span className="demo-pulse" />
          <b>DEMO PROVIDER</b>
          <span>Real Compact primitives · deterministic local execution · no live network transaction</span>
          <button onClick={() => setDemoBanner(false)} aria-label="Dismiss demo banner">×</button>
        </div>
      )}
      <main>
        {view === 'home' && <Home onLaunch={() => navigate('dashboard')} onVerify={() => navigate('receipt')} />}
        {view === 'dashboard' && <Dashboard registry={registry} receipt={receipt} navigate={navigate} />}
        {view === 'registry' && <Registry registry={registry} setRegistry={setRegistry} onBack={() => navigate('dashboard')} />}
        {view === 'new-check' && <NewCheck registry={registry} onReceipt={setReceipt} navigate={navigate} />}
        {view === 'receipt' && <ReceiptVerifier initial={receipt} />}
      </main>
      <Footer />
    </div>
  )
}

function Header({ navigate }: { navigate: (view: View) => void }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => navigate('home')} aria-label="ConflictZero home">
        <span className="brand-orbit"><span>C0</span></span>
        <span className="brand-word">conflict<span>zero</span></span>
      </button>
      <nav aria-label="Primary navigation">
        <button onClick={() => navigate('dashboard')}>Workspace</button>
        <button onClick={() => navigate('receipt')}>Verify</button>
      </nav>
      <button className="firm-pill" onClick={() => navigate('dashboard')}>
        <span className="status-light" />
        Hartwell &amp; Vale
        <span aria-hidden="true">⌄</span>
      </button>
    </header>
  )
}

function Home({ onLaunch, onVerify }: { onLaunch: () => void; onVerify: () => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="overline"><span /> PRIVATE CONFLICT CLEARANCE</div>
          <h1>Prove the check.<br /><em>Reveal nothing.</em></h1>
          <p>ConflictZero turns a confidential conflict search into portable evidence—without publishing the clients, matters, or relationships behind the decision.</p>
          <div className="hero-actions">
            <button className="primary glow" onClick={onLaunch}>Enter proof workspace <span>→</span></button>
            <button className="ghost" onClick={onVerify}>Inspect a receipt</button>
          </div>
          <div className="hero-stats">
            <span><b>8</b> private registry slots</span>
            <span><b>32</b> pairwise checks</span>
            <span><b>0</b> names disclosed</span>
          </div>
        </div>
        <LiveProofPreview />
      </section>

      <section className="privacy-thesis">
        <div className="section-heading">
          <div className="overline"><span /> THE PRIVACY BOUNDARY</div>
          <h2>One computation. Two realities.</h2>
          <p>The firm sees sensitive relationships. The public sees only the cryptographic consequence.</p>
        </div>
        <div className="boundary-grid">
          <article className="boundary-card private-card">
            <div className="card-kicker"><span className="lock-dot">⌑</span> PRIVATE WITNESS</div>
            <h3>What the circuit knows</h3>
            <ul>
              <li><span>Client registry</span><b>8 fixed slots</b></li>
              <li><span>Engagement parties</span><b>4 fixed slots</b></li>
              <li><span>Matching relationship</span><b>Never exported</b></li>
            </ul>
          </article>
          <div className="boundary-engine" aria-hidden="true">
            <div className="engine-rings"><span /><span /><span /></div>
            <b>proveClear</b>
            <small>COMPACT CIRCUIT</small>
          </div>
          <article className="boundary-card public-card">
            <div className="card-kicker"><span className="receipt-dot">✓</span> PUBLIC RECEIPT</div>
            <h3>What the world can verify</h3>
            <ul>
              <li><span>Registry version</span><b>v1</b></li>
              <li><span>Engagement digest</span><b>0x••••</b></li>
              <li><span>Clearance result</span><b>Proven</b></li>
            </ul>
          </article>
        </div>
      </section>
    </>
  )
}

function LiveProofPreview() {
  const cells = Array.from({ length: 24 })
  return (
    <div className="hero-console" aria-label="Animated proof preview">
      <div className="console-chrome">
        <span /><span /><span />
        <b>CONFLICTZERO / PROOF TRACE</b>
        <small>LIVE</small>
      </div>
      <div className="console-body">
        <div className="console-row">
          <span className="console-label">PRIVATE INPUT</span>
          <div className="masked-entity"><i>OC</i><span>Orchid Capital</span><b>SEALED</b></div>
          <div className="masked-entity muted"><i>••</i><span>4 protected entities</span><b>LOCAL</b></div>
        </div>
        <div className="console-divider"><span>COMPACT WITNESS BOUNDARY</span></div>
        <div className="matrix-header"><span>PAIRWISE DISJOINTNESS</span><b>32 CONSTRAINTS</b></div>
        <div className="mini-matrix">
          {cells.map((_, index) => <span key={index} style={{ animationDelay: `${index * 70}ms` }} />)}
        </div>
        <div className="console-trace">
          <p><span>01</span> normalize identifiers <b>done</b></p>
          <p><span>02</span> open registry commitment <b>done</b></p>
          <p><span>03</span> assert no private match <b className="working">running</b></p>
        </div>
        <div className="proof-capsule">
          <span className="capsule-check">✓</span>
          <div><small>PUBLIC OUTPUT</small><b>Clearance receipt ready</b></div>
          <code>0x9f3a…81c2</code>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ registry, receipt, navigate }: { registry: RegistryEntry[]; receipt: Receipt | null; navigate: (view: View) => void }) {
  return (
    <div className="workspace">
      <section className="workspace-hero">
        <div>
          <div className="overline"><span /> FIRM PROOF CONSOLE</div>
          <h1>Good evening, Avery.</h1>
          <p>Your private registry is sealed and ready for a new clearance proof.</p>
        </div>
        <button className="primary glow" onClick={() => navigate('new-check')}>Run private check <span>→</span></button>
      </section>

      <section className="metrics">
        <article><small>REGISTRY STATE</small><strong><i className="live-dot" /> Protected</strong><span>Compact commitment ready</span></article>
        <article><small>PRIVATE WITNESS</small><strong>{registry.length}<em> / 8</em></strong><span>Exact organization identifiers</span></article>
        <article><small>CIRCUIT CAPACITY</small><strong>32</strong><span>Pairwise equality constraints</span></article>
        <article><small>PUBLIC LEAKAGE</small><strong>0</strong><span>Client names or failed checks</span></article>
      </section>

      <div className="dashboard-grid">
        <section className="panel registry-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">PRIVATE SIDE</span><h2>Relationship vault</h2></div>
            <button className="text-link" onClick={() => navigate('registry')}>Manage →</button>
          </div>
          <div className="vault-visual">
            <div className="vault-ring"><span>⌑</span></div>
            <div><small>COMPACT REGISTRY COMMITMENT · V1</small><code>{receipt?.registryCommitment ?? 'Generated on first proof'}</code></div>
            <b>SEALED</b>
          </div>
          <div className="masked-list">
            {registry.slice(0, 3).map((item, index) => (
              <div key={item.id}><span>0{index + 1}</span><i>{item.name.slice(0, 1)}</i><b>{item.name}</b><small>{item.role}</small><em>PRIVATE</em></div>
            ))}
            {registry.length > 3 && <button onClick={() => navigate('registry')}>+ {registry.length - 3} more sealed relationships</button>}
          </div>
        </section>

        <section className="panel receipt-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker public">PUBLIC SIDE</span><h2>Latest clearance</h2></div>
            {receipt && <button className="text-link" onClick={() => navigate('receipt')}>Verify →</button>}
          </div>
          {receipt ? <ReceiptCapsule receipt={receipt} /> : (
            <div className="no-receipt">
              <div className="empty-ledger"><span /><span /><span /></div>
              <h3>No receipt in this session</h3>
              <p>Run a clean engagement through the circuit to watch a public proof capsule emerge.</p>
              <button className="secondary" onClick={() => navigate('new-check')}>Start first proof</button>
            </div>
          )}
        </section>
      </div>

      <section className="explain-strip">
        <div className="strip-icon">?</div>
        <div><b>The most sensitive result is the one we never publish.</b><p>If a relationship matches, the publication gate closes locally. No failed check, matching client, or engagement trail reaches public state.</p></div>
        <button onClick={() => navigate('new-check')}>See both outcomes →</button>
      </section>
    </div>
  )
}

function ReceiptCapsule({ receipt }: { receipt: Receipt }) {
  return (
    <div className="receipt-capsule-large">
      <div className="receipt-seal"><span>✓</span><i /></div>
      <div className="receipt-title"><small>PUBLIC CLEARANCE RECEIPT</small><h3>Exact-set disjointness verified</h3><p>Receipt {receipt.id}</p></div>
      <dl>
        <div><dt>Registry</dt><dd>Version {receipt.registryVersion}</dd></div>
        <div><dt>Engagement</dt><dd><code>{receipt.engagementHash}</code></dd></div>
        <div><dt>Proposal</dt><dd><code>{receipt.proposalCommitment ?? '—'}</code></dd></div>
        <div><dt>Provider tx</dt><dd>{receipt.transactionId ?? '—'}</dd></div>
      </dl>
      <div className="receipt-foot"><span>Names disclosed</span><b>0</b></div>
    </div>
  )
}

function Registry({ registry, setRegistry, onBack }: { registry: RegistryEntry[]; setRegistry: (registry: RegistryEntry[]) => void; onBack: () => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Active client')
  const atCapacity = registry.length >= 8
  const add = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || atCapacity) return
    setRegistry([...registry, { id: crypto.randomUUID(), name: name.trim(), role, added: 'Just now' }])
    setName('')
  }
  return (
    <div className="workspace">
      <button className="back" onClick={onBack}>← Proof console</button>
      <section className="registry-heading">
        <div><div className="overline"><span /> PRIVATE WITNESS BUILDER</div><h1>Relationship vault</h1><p>These identifiers become private circuit inputs. They are never written to the receipt.</p></div>
        <div className="capacity-dial"><span style={{ '--fill': `${registry.length / 8 * 100}%` } as React.CSSProperties}><b>{registry.length}</b><small>OF 8</small></span><p>CIRCUIT<br />CAPACITY</p></div>
      </section>
      <div className="registry-layout">
        <section className="panel registry-table">
          <div className="table-head"><span>SLOT</span><span>PRIVATE ORGANIZATION</span><span>RELATIONSHIP</span><span>WITNESS STATE</span><span /></div>
          {registry.map((entry, index) => (
            <div className="entity-row" key={entry.id}>
              <code>{String(index + 1).padStart(2, '0')}</code>
              <div className="entity-name"><i>{entry.name.slice(0, 1)}</i><span><b>{entry.name}</b><small>name:{entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</small></span></div>
              <span>{entry.role}</span>
              <em><i /> SEALED</em>
              <button aria-label={`Remove ${entry.name}`} onClick={() => setRegistry(registry.filter(item => item.id !== entry.id))}>×</button>
            </div>
          ))}
          {Array.from({ length: 8 - registry.length }).map((_, index) => (
            <div className="entity-row empty" key={`empty-${index}`}><code>{String(registry.length + index + 1).padStart(2, '0')}</code><span>Deterministic private padding</span><span>—</span><em>INACTIVE</em><span /></div>
          ))}
        </section>
        <aside className="panel add-entity">
          <span className="private-badge">⌑ LOCAL ONLY</span>
          <h2>Add protected relationship</h2>
          <p>The normalized identifier becomes a private Compact fingerprint when a proof runs.</p>
          <form onSubmit={add}>
            <label>Organization name<input value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Meridian Holdings" disabled={atCapacity} /></label>
            <label>Relationship<select value={role} onChange={event => setRole(event.target.value)} disabled={atCapacity}><option>Active client</option><option>Former client</option><option>Counterparty</option><option>Restricted party</option></select></label>
            <button className="primary" type="submit" disabled={atCapacity}>{atCapacity ? 'Circuit at capacity' : 'Seal into registry'} <span>+</span></button>
          </form>
          <div className="never-public"><b>Never public</b><span>Names · roles · matching entry · registry size</span></div>
        </aside>
      </div>
    </div>
  )
}

function NewCheck({ registry, onReceipt, navigate }: { registry: RegistryEntry[]; onReceipt: (receipt: Receipt) => void; navigate: (view: View) => void }) {
  const [company, setCompany] = useState('Orchid Capital')
  const [matter, setMatter] = useState('Commercial advisory')
  const [parties, setParties] = useState('Apex Materials')
  const [state, setState] = useState<CheckState>('editing')
  const [phase, setPhase] = useState(0)
  const [result, setResult] = useState<Receipt | null>(null)
  const [engagement, setEngagement] = useState<Engagement | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (state !== 'running') return
    const timer = window.setInterval(() => setPhase(current => Math.min(current + 1, 5)), 760)
    return () => window.clearInterval(timer)
  }, [state])

  useEffect(() => {
    if (state !== 'running' || phase < 5 || !result) return
    if (result.status === 'cleared') {
      onReceipt(result)
      setState('cleared')
    } else {
      setState('review')
    }
  }, [phase, result, state, onReceipt])

  const partyList = useMemo(() => parties.split(',').map(value => value.trim()).filter(Boolean), [parties])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (partyList.length > 3) {
      setError('The prototype circuit supports one prospective client plus up to three involved organizations.')
      return
    }
    const nextEngagement: Engagement = { id: crypto.randomUUID(), company, matter, parties: partyList, createdAt: new Date().toISOString() }
    setEngagement(nextEngagement)
    setResult(null)
    setPhase(0)
    setState('running')
    window.scrollTo({ top: 0, behavior: 'instant' })
    try {
      setResult(await demoConflictService.check(nextEngagement, registry))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The private proof could not be completed.')
      setState('error')
    }
  }

  if (state !== 'editing' && state !== 'error' && engagement) {
    return (
      <ProofTheater
        engagement={engagement}
        registry={registry}
        phase={state === 'running' ? phase : 5}
        outcome={state === 'running' ? undefined : state}
        receipt={result}
        onVerify={() => navigate('receipt')}
        onReset={() => { setState('editing'); setPhase(0); setResult(null); window.scrollTo({ top: 0, behavior: 'instant' }) }}
        onWorkspace={() => navigate('dashboard')}
      />
    )
  }

  return (
    <div className="workspace check-workspace">
      <button className="back" onClick={() => navigate('dashboard')}>← Proof console</button>
      <div className="check-grid">
        <section className="check-form-wrap">
          <div className="overline"><span /> NEW PRIVATE COMPUTATION</div>
          <h1>Define the engagement.</h1>
          <p>Confirm the exact organizations the circuit should compare. Nothing entered here becomes public.</p>
          <form className="check-form" onSubmit={submit}>
            {error && <div className="form-error" role="alert"><b>Proof preparation stopped</b>{error}</div>}
            <label>Prospective client<input required value={company} onChange={event => setCompany(event.target.value)} /></label>
            <label>Matter description<input required value={matter} onChange={event => setMatter(event.target.value)} /></label>
            <label>Involved organizations <small>Separate up to three with commas</small><textarea required value={parties} onChange={event => setParties(event.target.value)} /></label>
            <button className="primary glow" type="submit">Enter proof theater <span>→</span></button>
          </form>
        </section>
        <aside className="input-inspector">
          <div className="inspector-head"><span>LIVE INPUT MAP</span><b>PRIVATE</b></div>
          <div className="input-flow">
            <small>ENGAGEMENT WITNESS</small>
            {[company, ...partyList].map((entity, index) => (
              <div className="input-token" key={`${entity}-${index}`}><span>0{index + 1}</span><i>{entity.slice(0, 1)}</i><div><b>{entity}</b><code>name:{entity.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</code></div><em>LOCAL</em></div>
            ))}
            {Array.from({ length: Math.max(0, 4 - partyList.length - 1) }).map((_, index) => <div className="input-token empty" key={index}><span>0{partyList.length + index + 2}</span><i>·</i><div><b>Inactive slot</b><code>0x00…00</code></div><em>PAD</em></div>)}
          </div>
          <div className="inspector-divider"><span>AFTER PROVING</span></div>
          <div className="public-preview"><small>PUBLIC RECEIPT WILL CONTAIN</small><span>✓ Engagement digest</span><span>✓ Registry commitment + version</span><span>✓ Proposal commitment + nonce</span><b>0 organization names</b></div>
          <button className="conflict-shortcut" onClick={() => setParties('Northstar Group')}><span>!</span><div><b>Demo the privacy failure path</b><small>Use Northstar Group to trigger a private match</small></div><em>TRY IT</em></button>
        </aside>
      </div>
    </div>
  )
}

function ProofTheater({ engagement, registry, phase, outcome, receipt, onVerify, onReset, onWorkspace }: {
  engagement: Engagement
  registry: RegistryEntry[]
  phase: number
  outcome?: CheckState
  receipt: Receipt | null
  onVerify: () => void
  onReset: () => void
  onWorkspace: () => void
}) {
  const isReview = outcome === 'review'
  const isCleared = outcome === 'cleared'
  const currentStage = proofStages[Math.min(phase, 4)]
  const engagementEntities = [engagement.company, ...engagement.parties]

  return (
    <div className={`proof-theater ${isReview ? 'is-review' : ''} ${isCleared ? 'is-cleared' : ''}`} aria-live="polite">
      <div className="theater-head">
        <div><div className="overline"><span /> ZERO-KNOWLEDGE PROOF THEATER</div><h1>{isReview ? 'Publication stopped.' : isCleared ? 'Clearance emerged.' : currentStage.label}</h1></div>
        <div className="run-id"><small>COMPUTATION</small><code>{engagement.id.slice(0, 8).toUpperCase()}</code><span>{isReview ? 'PRIVATE REVIEW' : isCleared ? 'COMPLETE' : 'RUNNING'}</span></div>
      </div>

      <div className="stage-timeline" role="progressbar" aria-valuemin={0} aria-valuemax={5} aria-valuenow={phase}>
        {proofStages.map((stage, index) => (
          <div className={`${index < phase ? 'complete' : ''} ${index === Math.min(phase, 4) && !outcome ? 'active' : ''} ${isReview && index === 4 ? 'blocked' : ''}`} key={stage.number}>
            <span>{isReview && index === 4 ? '×' : index < phase ? '✓' : stage.number}</span><b>{stage.label}</b><i />
          </div>
        ))}
      </div>

      <div className="theater-stage">
        <section className="witness-column">
          <div className="column-label"><span>⌑ PRIVATE WITNESS</span><b>LOCAL MEMORY</b></div>
          <h2>What the circuit can see</h2>
          <small>ENGAGEMENT PARTIES</small>
          <div className="witness-chips">
            {engagementEntities.map((entity, index) => <span key={entity}><i>{index + 1}</i>{phase >= 1 ? `name:${entity.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : entity}<b>⌑</b></span>)}
          </div>
          <small>SEALED REGISTRY · {registry.length} ACTIVE / 8 SLOTS</small>
          <div className="registry-stack">
            {Array.from({ length: 8 }).map((_, index) => <span key={index} className={index < registry.length ? 'active' : ''}><i>{String(index + 1).padStart(2, '0')}</i><code>{phase >= 2 ? (index < registry.length ? `0x${(index * 7919 + 4831).toString(16).padStart(8, '0')}••••` : '0x00000000') : '••••••••••••'}</code><em>{index < registry.length ? 'ACTIVE' : 'PAD'}</em></span>)}
          </div>
          <div className="privacy-seal"><span>Names remain inside this boundary</span><b>NO NETWORK ACCESS</b></div>
        </section>

        <section className="circuit-column">
          <div className="column-label"><span>◇ COMPACT CIRCUIT</span><b>proveClear</b></div>
          <div className={`circuit-core ${phase >= 2 ? 'energized' : ''} ${isReview ? 'failed' : ''} ${isCleared ? 'passed' : ''}`}>
            <span className="core-ring ring-one" /><span className="core-ring ring-two" /><span className="core-ring ring-three" />
            <div><b>{isReview ? '!' : isCleared ? '✓' : phase >= 3 ? '32' : '◇'}</b><small>{isReview ? 'MATCH' : isCleared ? 'CLEAR' : phase >= 3 ? 'CHECKS' : 'READY'}</small></div>
          </div>
          <div className="comparison-label"><span>ENGAGEMENT × REGISTRY</span><b>{phase >= 3 ? 'SCANNING ALL PAIRS' : 'WAITING'}</b></div>
          <div className="comparison-matrix">
            {Array.from({ length: 32 }).map((_, index) => {
              const conflict = isReview && index === 8
              return <span key={index} className={`${phase >= 3 ? 'scanned' : ''} ${conflict ? 'conflict' : ''}`} style={{ animationDelay: `${(index % 8) * 60}ms` }}>{conflict ? '×' : phase >= 3 ? '✓' : ''}</span>
            })}
          </div>
          <div className="circuit-assertion"><code>assert registry[i].fingerprint ≠ engagement[j].fingerprint</code><span>{isReview ? 'FALSE AT PRIVATE PAIR' : phase >= 4 ? 'TRUE FOR ALL ACTIVE PAIRS' : 'EVALUATING…'}</span></div>
        </section>

        <section className="public-column">
          <div className="column-label"><span>✓ PUBLIC STATE</span><b>SELECTIVE DISCLOSURE</b></div>
          <h2>What the world can see</h2>
          <div className={`publication-gate ${phase >= 4 ? 'active' : ''} ${isReview ? 'closed' : ''}`}>
            <div className="gate-line" /><div className="gate-icon">{isReview ? '×' : phase >= 4 ? '✓' : '⌁'}</div><div className="gate-line" />
            <b>{isReview ? 'PUBLICATION GATE CLOSED' : phase >= 4 ? 'PUBLICATION GATE OPEN' : 'AWAITING CIRCUIT ASSERTION'}</b>
          </div>
          {isReview ? (
            <div className="suppressed-receipt">
              <div className="suppressed-icon">∅</div>
              <h3>No receipt created</h3>
              <p>The match remains inside the firm. Public observers cannot tell that this engagement was checked—or which relationship caused it to stop.</p>
              <dl><div><dt>Ledger writes</dt><dd>0</dd></div><div><dt>Names leaked</dt><dd>0</dd></div><div><dt>Public failure record</dt><dd>None</dd></div></dl>
            </div>
          ) : phase >= 5 && receipt ? (
            <ReceiptCapsule receipt={receipt} />
          ) : (
            <div className="receipt-skeleton"><span /><span /><span /><span /><p>No public data exists until the proof passes.</p></div>
          )}
        </section>
      </div>

      <div className={`theater-status ${isReview ? 'danger' : isCleared ? 'success' : ''}`}>
        <div className="status-symbol">{isReview ? '!' : isCleared ? '✓' : <span className="status-spinner" />}</div>
        <div><small>{isReview ? 'PRIVATE ASSERTION FAILED' : isCleared ? 'PROOF PIPELINE COMPLETE' : `STAGE ${Math.min(phase + 1, 5)} OF 5`}</small><b>{isReview ? 'A protected relationship requires human review.' : isCleared ? 'A public receipt exists without exposing the private witness.' : currentStage.detail}</b></div>
        <code>{isReview ? '0 PUBLIC WRITES' : isCleared ? receipt?.transactionId : 'WITNESS REMAINS LOCAL'}</code>
      </div>

      {(isReview || isCleared) && (
        <div className="theater-actions">
          {isCleared && <button className="primary glow" onClick={onVerify}>Verify public receipt <span>→</span></button>}
          <button className="secondary" onClick={onReset}>Run another scenario</button>
          <button className="text-link" onClick={onWorkspace}>Return to workspace</button>
        </div>
      )}
    </div>
  )
}

function ReceiptVerifier({ initial }: { initial: Receipt | null }) {
  const [id, setId] = useState(initial?.id ?? '')
  const [result, setResult] = useState<Receipt | null>(initial)
  const [searched, setSearched] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const verify = async (event: FormEvent) => {
    event.preventDefault()
    setSearched(true)
    setVerifying(true)
    setResult(await demoConflictService.verify(id))
    setVerifying(false)
  }

  return (
    <div className="verify-page">
      <section className="verify-hero">
        <div className="overline"><span /> PUBLIC VERIFICATION PORTAL</div>
        <h1>Verify the evidence.<br /><em>Not the secrets.</em></h1>
        <p>Anyone can inspect a clearance receipt. No access to the firm's client registry is required—or possible.</p>
        <form className="verify-form" onSubmit={verify}>
          <label><span>RECEIPT IDENTIFIER</span><input value={id} onChange={event => setId(event.target.value)} placeholder="CZ-XXXXXXXX" aria-label="Receipt identifier" /></label>
          <button className="primary glow" disabled={verifying}>{verifying ? 'Reading public state…' : 'Verify receipt'} <span>→</span></button>
        </form>
      </section>
      {searched && !result && !verifying && <div className="not-found"><span>!</span><div><b>Receipt not found</b><p>Failed checks never create public records. Run a clean proof in this demo session first.</p></div></div>}
      {result && (
        <section className="verification-result">
          <div className="verification-side">
            <span className="verified-orbit">✓</span>
            <small>CRYPTOGRAPHIC STATUS</small>
            <h2>Clearance verified</h2>
            <p>The engagement digest was proven disjoint from the exact fingerprints in registry version {result.registryVersion}.</p>
            <div className="verification-badges"><span>✓ Integrity intact</span><span>✓ Nonce consumed</span><span>✓ Registry bound</span></div>
          </div>
          <ReceiptCapsule receipt={result} />
        </section>
      )}
      <section className="absence-proof">
        <span>∅</span><div><small>INTENTIONALLY ABSENT</small><b>Client names · matter text · relationship types · registry fingerprints · failed checks</b></div>
      </section>
    </div>
  )
}

function Footer() {
  return <footer><span>CONFLICTZERO / 2026</span><span>BUILT FOR MIDNIGHT HACKATHON</span><span>EXACT PROOF. MINIMUM DISCLOSURE.</span></footer>
}

export default App
