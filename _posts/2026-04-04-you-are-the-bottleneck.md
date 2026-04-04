---
published: true
layout: post
title: "You Are the Bottleneck"
description: "AI coding agents write fast. You review slow. Step one: stop wasting your review cycles on lint."
modified: 2026-04-04
tags:
  - Theory of Constraints
  - AI
  - DevOps
  - CI/CD
categories:
  - AI and Technology
---

<style>
.toc-section { margin: 4rem 0; max-width: none; font: inherit; opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
:where(.toc-section) div { margin: 0; max-width: none; font: inherit; }
.toc-section.visible { opacity: 1; transform: translateY(0); }
.toc-scene { margin: 2rem 0; text-align: center; max-width: none; }
.toc-scene svg { display: block; max-width: 100%; height: auto; margin: 0 auto; }
.toc-scene svg text { fill: currentColor; }
.toc-scene svg .label { opacity: 0.7; }
.toc-scene svg .accent { fill: #8eca9d; }
.toc-scene svg .warn { fill: #d90; }
.toc-scene svg .bad { fill: #a33; }
.toc-scene svg line { stroke: currentColor; opacity: 0.2; }
.toc-scene svg circle { transition: opacity 0.4s ease; }
.toc-em { background: rgba(142, 202, 157, 0.25); padding: 2px 6px; border-radius: 3px; }
.toc-math { font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 90%; line-height: 2.2; margin: 1.5rem 0; padding-left: 1rem; border-left: 3px solid #8eca9d; }
.toc-math .total { font-weight: 700; border-top: 1px solid currentColor; padding-top: 0.5rem; margin-top: 0.5rem; opacity: 0.9; }
.toc-big { font-size: 1.5rem; font-weight: 700; }
.toc-def { margin: 1.5rem 0; font-size: 1rem; line-height: 2; }
.toc-pipeline { margin: 2rem 0; max-width: none; }
.toc-pipeline-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 0 0 1rem; max-width: none; font-size: 0.9rem; }
.toc-pipeline-stats strong { font-weight: 700; }
.toc-pipeline-controls { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin: 0; max-width: none; }
.toc-btn { display: inline-flex; align-items: center; justify-content: center; appearance: none; -webkit-appearance: none; padding: 0.5rem 1.25rem; font: inherit; font-size: 0.875rem; line-height: 1.2; border: 2px solid #8eca9d; border-radius: 999px; background: transparent; cursor: pointer; color: inherit; transition: background 0.2s, opacity 0.2s; }
.toc-btn:hover { background: rgba(142, 202, 157, 0.15); }
.toc-btn-dim { border-color: currentColor; opacity: 0.5; }
.toc-btn-dim:hover { opacity: 0.8; }
.toc-btn-disabled { opacity: 0.3; cursor: default; pointer-events: none; }
.toc-link { appearance: none; -webkit-appearance: none; padding: 0; border: 0; background: transparent; font: inherit; font-size: 0.75rem; opacity: 0.6; text-decoration: underline; cursor: pointer; margin-left: 0.5rem; color: inherit; }
.toc-link:hover { opacity: 1; }
.toc-btn:focus-visible, .toc-link:focus-visible { outline: 2px solid #8eca9d; outline-offset: 2px; }
.toc-note { font-size: 0.85rem; opacity: 0.7; font-style: italic; margin-top: 2rem; }
@media (prefers-color-scheme: dark) {
  .toc-scene svg .bad { fill: #e06666; }
}
</style>
<noscript><style>.toc-section { opacity: 1; transform: none; }</style></noscript>

*Part 1 of a series on AI coding agents and throughput.*

---

This dot is you.

<div class="toc-section" data-anim>
<div class="toc-scene">
<svg viewBox="0 0 460 70" aria-label="You — the constraint — represented as a single dot">
<circle cx="230" cy="30" r="8" fill="currentColor"/>
<text x="230" y="55" text-anchor="middle" font-size="11" class="label">you</text>
</svg>
</div>

You review code that AI agents write for you. Nothing ships until you say so.

That makes you the <span class="toc-em">constraint</span>. That's not an insult, because the bottleneck is always a person. The system can't move faster than you can read.
</div>

<div class="toc-section" data-anim>

<h2>Your agents just dropped off 10 PRs</h2>

<p>They're fast! Good for them.</p>

<div class="toc-scene">
<svg viewBox="0 0 460 70" aria-label="Ten PRs represented as numbered dots">
<circle cx="50" cy="30" r="8" fill="currentColor"/><text x="50" y="55" text-anchor="middle" font-size="10" class="label">1</text>
<circle cx="90" cy="30" r="8" fill="currentColor"/><text x="90" y="55" text-anchor="middle" font-size="10" class="label">2</text>
<circle cx="130" cy="30" r="8" fill="currentColor"/><text x="130" y="55" text-anchor="middle" font-size="10" class="label">3</text>
<circle cx="170" cy="30" r="8" fill="currentColor"/><text x="170" y="55" text-anchor="middle" font-size="10" class="label">4</text>
<circle cx="210" cy="30" r="8" fill="currentColor"/><text x="210" y="55" text-anchor="middle" font-size="10" class="label">5</text>
<circle cx="250" cy="30" r="8" fill="currentColor"/><text x="250" y="55" text-anchor="middle" font-size="10" class="label">6</text>
<circle cx="290" cy="30" r="8" fill="currentColor"/><text x="290" y="55" text-anchor="middle" font-size="10" class="label">7</text>
<circle cx="330" cy="30" r="8" fill="currentColor"/><text x="330" y="55" text-anchor="middle" font-size="10" class="label">8</text>
<circle cx="370" cy="30" r="8" fill="currentColor"/><text x="370" y="55" text-anchor="middle" font-size="10" class="label">9</text>
<circle cx="410" cy="30" r="8" fill="currentColor"/><text x="410" y="55" text-anchor="middle" font-size="10" class="label">10</text>
</svg>
</div>
</div>

<div class="toc-section" data-anim>

<h2>Uh oh</h2>

<div class="toc-scene">
<svg viewBox="0 0 460 80" aria-label="Nine bad PRs shown in red, one good PR in default color">
<circle cx="50" cy="30" r="8" class="bad"/><text x="50" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="90" cy="30" r="8" class="bad"/><text x="90" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="130" cy="30" r="8" class="bad"/><text x="130" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="170" cy="30" r="8" class="bad"/><text x="170" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="210" cy="30" r="8" class="bad"/><text x="210" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="250" cy="30" r="8" class="bad"/><text x="250" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="290" cy="30" r="8" class="bad"/><text x="290" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="330" cy="30" r="8" class="bad"/><text x="330" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="370" cy="30" r="8" class="bad"/><text x="370" y="55" text-anchor="middle" font-size="9" class="bad">bad</text>
<circle cx="410" cy="30" r="8" fill="currentColor"/><text x="410" y="55" text-anchor="middle" font-size="9" class="label">ok</text>
</svg>
</div>

<p>9 out of 10 have problems. But wait...</p>
</div>

<div class="toc-section" data-anim>

<h2>Most of those problems are <em>dumb</em></h2>

<p>Wrong indentation, missing semicolons, someone forgot to run the formatter.</p>

<p>Only <strong>2</strong> have actual bugs — the kind that need your brain.</p>

<div class="toc-scene">
<svg viewBox="0 0 460 80" aria-label="Seven trivial issues in yellow, two real bugs in red, one clean">
<circle cx="50" cy="30" r="8" class="warn"/><text x="50" y="55" text-anchor="middle" font-size="8" class="label">trivial</text>
<circle cx="90" cy="30" r="8" class="warn"/><text x="90" y="55" text-anchor="middle" font-size="8" class="label">trivial</text>
<circle cx="130" cy="30" r="8" class="warn"/><text x="130" y="55" text-anchor="middle" font-size="8" class="label">trivial</text>
<circle cx="170" cy="30" r="8" class="warn"/><text x="170" y="55" text-anchor="middle" font-size="8" class="label">trivial</text>
<circle cx="210" cy="30" r="8" class="warn"/><text x="210" y="55" text-anchor="middle" font-size="8" class="label">trivial</text>
<circle cx="250" cy="30" r="8" class="warn"/><text x="250" y="55" text-anchor="middle" font-size="8" class="label">trivial</text>
<circle cx="290" cy="30" r="8" class="warn"/><text x="290" y="55" text-anchor="middle" font-size="8" class="label">trivial</text>
<circle cx="330" cy="30" r="8" class="bad"/><text x="330" y="55" text-anchor="middle" font-size="8" class="label">real bug</text>
<circle cx="370" cy="30" r="8" class="bad"/><text x="370" y="55" text-anchor="middle" font-size="8" class="label">real bug</text>
<circle cx="410" cy="30" r="8" fill="currentColor"/><text x="410" y="55" text-anchor="middle" font-size="8" class="label">clean</text>
</svg>
</div>

<p><em>7 trivial · 2 real bugs · 1 clean</em></p>
</div>

<div class="toc-section" data-anim>

<h2>Without CI: all 10 land on your desk</h2>

<p>Go ahead, send some through:</p>

<div class="toc-pipeline" id="pipeline-no-ci"></div>
</div>

<div class="toc-section" data-anim>

<h2>So here's what just happened</h2>

<div class="toc-math">
<div>10 first reviews</div>
<div>+ 9 re-reviews</div>
<div class="total">= up to 19 reviews</div>
</div>

<p>And 7 of those round-trips? For stuff a computer could catch in 2 seconds.</p>

<p><em>You — the scarce resource, the only person who can hit merge — spent your afternoon being a spellchecker.</em></p>
</div>

<div class="toc-section" data-anim>

<h2>What if we put some cheap robots in front?</h2>

<p>A linter and a formatter. Nothing fancy, and these have existed forever.</p>

<div class="toc-scene">
<svg viewBox="0 0 460 70" aria-label="Pipeline showing linter and formatter before tech lead">
<circle cx="100" cy="30" r="6" class="accent"/><text x="100" y="55" text-anchor="middle" font-size="10" class="label">linter</text>
<line x1="115" y1="30" x2="175" y2="30"/>
<circle cx="190" cy="30" r="6" class="accent"/><text x="190" y="55" text-anchor="middle" font-size="10" class="label">formatter</text>
<line x1="205" y1="30" x2="275" y2="30"/>
<circle cx="290" cy="30" r="8" fill="currentColor"/><text x="290" y="10" text-anchor="middle" font-size="9" class="label">constraint ↓</text><text x="290" y="55" text-anchor="middle" font-size="11" font-weight="700">you</text>
</svg>
</div>

<p>They check every PR <em>before</em> it reaches you, so the dumb stuff gets bounced instantly. You never see it.</p>
</div>

<div class="toc-section" data-anim>

<h2>Same 10 PRs. This time with robots.</h2>

<p>Try it:</p>

<div class="toc-pipeline" id="pipeline-with-ci"></div>
</div>

<div class="toc-section" data-anim>

<h2>Look at that</h2>

<div class="toc-math">
<div>3 first reviews</div>
<div>+ 2 re-reviews (the real bugs)</div>
<div class="total">= 5 reviews</div>
</div>

<span class="toc-big">19 → 5</span>

<p>You're the same person with the same hours and the same brain. The only difference is less garbage in front of it.</p>
</div>

<div class="toc-section" data-anim>

<h2>There's a name for this</h2>

<p>In Theory of Constraints, it's called <span class="toc-em">exploiting</span> the constraint.</p>

<div class="toc-def">
<div><strong>Elevating</strong> = add capacity <span style="opacity:0.6">(clone yourself)</span></div>
<div><strong>Exploiting</strong> = protect existing capacity <span style="opacity:0.6">(stop feeding junk to the bottleneck)</span></div>
</div>

<p>The linter didn't make you faster. It made sure that when you <em>do</em> review something, it's worth reviewing.</p>

<p>And honestly? This part is kind of boring. Linters have existed for decades. If your agents are submitting PRs that fail lint, go fix that. We'll wait.</p>

<p>Okay. Here's where it gets interesting.</p>
</div>

<div class="toc-section" data-anim>

<h2>The thing everyone tries next doesn't work</h2>

<p>The pitch goes like this: <em>"Run 5 agents in parallel! 10x output!"</em></p>

<p>So now your agents produce 50 PRs a day instead of 5.</p>

<p>You still review... 5 a day.</p>

<p>Parallelization didn't increase <strong>throughput</strong>. It increased <strong>inventory</strong>, which means a growing pile of PRs sitting there, waiting for you, going stale.</p>

<p>More writers doesn't help when the reader is the bottleneck.</p>

<p><em>That's what Part 2 is about.</em></p>

<p class="toc-note">This series: (1) stop feeding junk to the bottleneck ← you are here · (2) why parallelization is a trap · (3) what actually moves the needle</p>
</div>

<script>
(function() {
  // Scroll-triggered animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Initialize pipeline if this section contains one
        const pipelineEl = entry.target.querySelector('.toc-pipeline');
        if (pipelineEl && !pipelineEl.dataset.init) {
          pipelineEl.dataset.init = '1';
          const hasCI = pipelineEl.id === 'pipeline-with-ci';
          createPipeline(pipelineEl, hasCI);
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.toc-section[data-anim]').forEach(el => observer.observe(el));

  // Pipeline simulation
  function createPipeline(mount, hasCI) {
    const types = ["lint","ok","fmt","lint","logic","fmt","lint","lint","fmt","logic"];
    const W = 460, Y = 50;
    const pos = hasCI
      ? { start: 20, lint: 100, fmt: 180, rev: 300, done: 420 }
      : { start: 30, rev: 200, done: 380 };

    let prs = [], sent = 0, counters = { rv: 0, bn: 0, mg: 0 };
    let raf, destroyed = false;

    const uid = 'pl-' + Math.random().toString(36).slice(2, 8);
    mount.innerHTML = `
      <div class="toc-scene"><svg id="${uid}-svg" viewBox="0 0 ${W} 120"></svg></div>
      <div class="toc-pipeline-stats">
        <span>merged <strong id="${uid}-merged">0</strong></span>
        <span>bounced <strong id="${uid}-bounced">0</strong></span>
        <span>reviews <strong id="${uid}-reviews">0</strong></span>
      </div>
      <div class="toc-pipeline-controls">
        <button type="button" class="toc-btn" id="${uid}-send">send PR #1</button>
        <button type="button" class="toc-btn toc-btn-dim" id="${uid}-all">send all</button>
        <button type="button" class="toc-link" id="${uid}-reset">reset</button>
      </div>`;

    const $ = id => document.getElementById(uid + '-' + id);
    const svg = $('svg'), sendBtn = $('send'), allBtn = $('all');

    function drawStatic() {
      let s = `<line x1="15" y1="${Y}" x2="${W-15}" y2="${Y}"/>`;
      s += `<line x1="15" y1="${Y+30}" x2="${W-15}" y2="${Y+30}" stroke-dasharray="4 4"/>`;
      s += `<text x="${W/2}" y="${Y+50}" text-anchor="middle" font-size="9" class="label">↩ bounced back</text>`;
      if (hasCI) {
        s += `<text x="${pos.lint}" y="${Y-22}" text-anchor="middle" font-size="10" class="label">linter</text>`;
        s += `<circle cx="${pos.lint}" cy="${Y}" r="4" class="accent"/>`;
        s += `<text x="${pos.fmt}" y="${Y-22}" text-anchor="middle" font-size="10" class="label">formatter</text>`;
        s += `<circle cx="${pos.fmt}" cy="${Y}" r="4" class="accent"/>`;
      }
      s += `<text x="${pos.rev}" y="${Y-30}" text-anchor="middle" font-size="9" class="label">constraint ↓</text>`;
      s += `<text x="${pos.rev}" y="${Y-18}" text-anchor="middle" font-size="11" font-weight="700">you</text>`;
      s += `<circle cx="${pos.rev}" cy="${Y}" r="4" fill="currentColor"/>`;
      s += `<text x="${pos.done}" y="${Y-18}" text-anchor="middle" font-size="10" class="label">merged ✓</text>`;
      return s;
    }
    const staticSVG = drawStatic();

    function spawnPR(idx) {
      if (idx >= 10) return;
      prs.push({ id: idx+1, type: types[idx], x: pos.start, atStation: null, timer: 0, done: false, bounced: false, bouncedOnce: false, opacity: 1, yOff: 0, heading: null, passedLint: false, passedFmt: false });
      sent = idx + 1;
      sendBtn.textContent = sent >= 10 ? "—" : `send PR #${sent+1}`;
      if (sent >= 10) { sendBtn.classList.add("toc-btn-disabled"); allBtn.classList.add("toc-btn-disabled"); }
    }

    sendBtn.onclick = () => { if (sent < 10) spawnPR(sent); };
    allBtn.onclick = () => {
      const start = sent;
      for (let i = 0; i < 10 - start; i++) {
        setTimeout(() => { if (!destroyed) spawnPR(start + i); }, i * 600);
      }
    };
    $('reset').onclick = () => {
      prs = []; sent = 0; counters = { rv: 0, bn: 0, mg: 0 };
      sendBtn.textContent = "send PR #1";
      sendBtn.classList.remove("toc-btn-disabled");
      allBtn.classList.remove("toc-btn-disabled");
      $('merged').textContent = "0";
      $('bounced').textContent = "0";
      $('reviews').textContent = "0";
    };

    let last = performance.now();
    function tick(now) {
      if (destroyed) return;
      const dt = Math.min(now - last, 40); last = now;
      const atSt = st => prs.find(p => p.atStation === st && !p.done && !p.bounced);

      for (let p of prs) {
        if (p.done || p.bounced) { p.timer += dt; if (p.timer > 600) p.opacity = Math.max(0, p.opacity - 0.015); continue; }

        let nextStation;
        if (hasCI) {
          if (!p.passedLint) nextStation = "lint";
          else if (!p.passedFmt) nextStation = "fmt";
          else nextStation = "rev";
        } else {
          nextStation = "rev";
        }
        const targetX = nextStation === "lint" ? pos.lint : nextStation === "fmt" ? pos.fmt : pos.rev;

        if (p.atStation) {
          p.timer += dt;
          const wt = p.atStation === "rev" ? 700 : 400;
          if (p.timer > wt) {
            if (p.atStation === "lint") {
              if (p.type === "lint") { p.bounced = true; p.timer = 0; p.yOff = 30; counters.bn++; $('bounced').textContent = counters.bn; }
              else { p.passedLint = true; p.atStation = null; p.timer = 0; }
            } else if (p.atStation === "fmt") {
              if (p.type === "fmt") { p.bounced = true; p.timer = 0; p.yOff = 30; counters.bn++; $('bounced').textContent = counters.bn; }
              else { p.passedFmt = true; p.atStation = null; p.timer = 0; }
            } else if (p.atStation === "rev") {
              if (p.type !== "ok" && !p.bouncedOnce) {
                p.bouncedOnce = true; p.bounced = true; p.timer = 0; p.yOff = 30; counters.bn++; $('bounced').textContent = counters.bn;
              } else { p.atStation = null; p.timer = 0; p.heading = "done"; }
            }
          }
        } else if (p.heading === "done") {
          p.x += (pos.done - p.x) * 0.1;
          if (Math.abs(p.x - pos.done) < 2) { p.x = pos.done; p.done = true; p.timer = 0; counters.mg++; $('merged').textContent = counters.mg; }
        } else {
          const occupied = atSt(nextStation);
          if (!occupied) {
            p.x += (targetX - p.x) * 0.1;
            if (Math.abs(p.x - targetX) < 2) {
              p.x = targetX; p.atStation = nextStation; p.timer = 0;
              if (nextStation === "rev") { counters.rv++; $('reviews').textContent = counters.rv; }
            }
          } else {
            const waiting = prs.filter(q => q !== p && !q.done && !q.bounced && !q.atStation && q.heading !== "done" && q.x < targetX && q.x > targetX - 60);
            const qi = waiting.filter(q => q.id < p.id).length;
            const qx = targetX - 18 - qi * 14;
            p.x += (qx - p.x) * 0.08;
          }
        }
      }
      prs = prs.filter(p => p.opacity > 0.05);

      let s = staticSVG;
      for (let p of prs) {
        const py = Y + p.yOff;
        const cls = p.bounced ? 'label' : p.done ? '' : p.type === "ok" ? '' : p.type === "logic" ? 'bad' : 'warn';
        s += `<g opacity="${p.opacity}"><circle cx="${p.x}" cy="${py}" r="6" class="${cls}" ${cls===''?'fill="currentColor"':''}/>`;
        s += `<text x="${p.x}" y="${py-10}" text-anchor="middle" font-size="8" class="label">${p.id}</text></g>`;
      }
      svg.innerHTML = s;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }
})();
</script>
