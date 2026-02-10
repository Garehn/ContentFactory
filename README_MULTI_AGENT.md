# 🎬 AI Content Engine - Multi-Agent System v2.0

Premium quality-first video production system using 4-agent orchestration for creating one exceptional Kurzgesagt-style video per day.

## 🆕 What's New in v2.0

### Multi-Agent Architecture
Replaces single-shot generation with a 4-agent workflow that prioritizes quality over token efficiency:

1. **Agent 1: The Strategist** - Audience analysis & emotional architecture
2. **Agent 2: The Investigator** - Research, facts & metaphor mining
3. **Agent 3: The Scribe** - Script writing in Kurzgesagt voice
4. **Agent 4: The Refiner** - Quality assurance with revision loops

### Key Features

✅ **Quality Scoring System**
- 6 metrics scored 1-10 (Hook, Arc, Pacing, Mechanisms, Clarity, Viral Potential)
- Scripts must score ≥8 on ALL metrics
- Automatic revision loops (max 2 iterations)

✅ **Real-Time Progress Tracking**
- Live streaming updates from each agent
- Visual progress bar showing current stage
- Agent status pills and percentage completion

✅ **Intermediate Outputs Visible**
- Strategic Brief (expandable)
- Research Dossier (expandable)
- Final Script with quality scores
- Revision count and assessment details

✅ **Audience Targeting**
- Optional audience input field
- Defaults to "Curious generalists aged 18-35"
- Strategist tailors approach based on audience profile

✅ **Premium UI**
- Two-column layout: Outputs vs. Live Preview
- Collapsible sections for agent outputs
- Quality metrics dashboard
- Modern glassmorphism design

---

## 📁 Project Structure

```
content-engine/
├── .agent/
│   └── skills/
│       ├── kurzgesagt-shorts-writer/    # Original single-agent skill (legacy)
│       │   └── SKILL.md
│       └── multi-agent-orchestrator/    # NEW: 4-agent system
│           └── MASTER_SKILL.md          # Complete orchestration guide
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Original single-agent UI (still works)
│   │   ├── multi-agent/                 # NEW: Multi-agent UI
│   │   │   └── page.tsx                 # Premium quality-first interface
│   │   └── api/
│   │       ├── generate/                # Legacy single-agent endpoint
│   │       ├── generate-multi-agent/    # NEW: 4-agent orchestrator
│   │       ├── voice/                   # ElevenLabs voiceover
│   │       ├── generate-image/          # Replicate Flux images
│   │       └── export/                  # Remotion server-side render
│   ├── components/
│   │   └── VideoPlayer.tsx              # Remotion player component
│   ├── remotion/
│   │   ├── Main.tsx                     # Video composition
│   │   ├── Scene.tsx                    # Individual scene component
│   │   └── index.ts                     # Entry point for bundling
│   └── lib/
│       └── claude.ts                    # Legacy Claude integration
└── README_MULTI_AGENT.md                # This file
```

---

## 🚀 Getting Started

### 1. Access the Multi-Agent System

Navigate to: `http://localhost:3000/multi-agent`

### 2. Input Your Topic
```
Topic: "Why quantum computers will change everything"
Audience: "Tech professionals aged 25-45 interested in AI"
```

### 3. Watch the Magic Happen

**Progress Flow:**
```
Strategist (0-25%) → Investigator (25-50%) → Scribe (50-70%) → Refiner (70-100%)
```

Each agent reports progress in real-time via Server-Sent Events (SSE).

### 4. Review Outputs

Expand the collapsible sections to see:
- **Strategic Brief**: Audience profile, emotional journey, perspective bomb
- **Research Dossier**: Counterintuitive facts, metaphors, hope angle
- **Final Script**: Complete with visual cues and scene breakdowns
- **Quality Scores**: 6 metrics with pass/fail indicators

### 5. Export Final Video

Once approved (all metrics ≥8):
- Click "Export MP4"
- Download production-ready video

---

## 🧠 How the Multi-Agent System Works

### Agent 1: The Strategist
**Input:** Topic + Audience  
**Output:** Strategic Brief

**Responsibilities:**
- Audience psychographics analysis
- Emotional journey mapping (Wonder → Tension → Hope)
- "Perspective Bomb" moment identification
- Kurzgesagt angle selection (counterintuitive hook)

**Token Budget:** ~2000-3000 tokens

---

### Agent 2: The Investigator
**Input:** Strategic Brief  
**Output:** Research Dossier

**Responsibilities:**
- Find 3-5 counterintuitive facts
- Build 2-3 animation-ready metaphors
- Historical context & timeline
- Future implications (near/mid/long-term)
- "Hope Angle" (solutions, progress, agency)

**Token Budget:** ~2000-3000 tokens

---

### Agent 3: The Scribe
**Input:** Strategic Brief + Research Dossier + (Revision Requests)  
**Output:** Draft Script (250-300 words, JSON format)

**Responsibilities:**
- Write in Kurzgesagt voice ("we" perspective, punchy sentences)
- 3-Act structure: Hook (0-20s) → Journey (20-90s) → Resolution (90-120s)
- Visual cues for animators in every scene
- Metaphor integration & perspective shifts

**Token Budget:** ~2000-3000 tokens per attempt

---

### Agent 4: The Refiner
**Input:** Strategic Brief + Research Dossier + Draft Script  
**Output:** Quality Assessment + Revision Requests

**Responsibilities:**
- Score 6 quality metrics (1-10 scale)
- Provide line-by-line revision requests if any score < 8
- Identify viral potential & shareability moments
- Approve or send back for revision (max 2 loops)

**Token Budget:** ~1500-2000 tokens per review

---

## 📊 Quality Metrics Explained

| Metric | What It Measures | Threshold |
|--------|------------------|-----------|
| **Hook Strength** | Does first 10s stop a scroll? | ≥8/10 |
| **Emotional Arc** | Clear journey: Wonder → Tension → Hope? | ≥8/10 |
| **Pacing** | Natural flow when read aloud? | ≥8/10 |
| **Kurzgesagt Mechanisms** | "We" voice, scale shifts, optimistic nihilism? | ≥8/10 |
| **Clarity** | Any confusing lines? Stats need context? | ≥8/10 |
| **Viral Potential** | One "OMG" shareable moment? | ≥8/10 |

**Overall Score:** Sum of all 6 metrics (max 60)
- **48-60:** Excellent, production-ready
- **42-47:** Good, but needs minor polish
- **<42:** Revision required

---

## 🔄 Revision Loop Logic

```
Draft Script → Refiner (Score)
    ↓
[Any score < 8?]
    ↓ YES → Revision Request → Scribe (Rewrite Round 1)
    ↓       ↓
    ↓       Refiner (Re-score)
    ↓           ↓
    ↓       [Still < 8?]
    ↓           ↓ YES → Revision Request → Scribe (Rewrite Round 2)
    ↓           ↓       ↓
    ↓           ↓       Refiner (Final Score)
    ↓           ↓           ↓
    ↓           ↓       [Still < 8?]
    ↓           ↓           ↓ YES → ⚠️ ESCALATE TO HUMAN
    ↓           ↓           ↓ NO → ✅ APPROVE
    ↓           ↓ NO → ✅ APPROVE
    ↓ NO → ✅ APPROVE
```

**Maximum 2 revision attempts** before human review is required.

---

## 💰 Token Economics

### Single-Agent System (Legacy)
- 1 Claude call: ~800-1000 tokens
- **Total cost per video:** ~$0.03-$0.05

### Multi-Agent System v2.0
- Agent 1 (Strategist): ~2500 tokens
- Agent 2 (Investigator): ~2500 tokens
- Agent 3 (Scribe): ~2500 tokens × (1-3 attempts)
- Agent 4 (Refiner): ~1500 tokens × (1-3 reviews)

**Average total:** ~12,000-18,000 tokens  
**Cost per video:** ~$0.40-$0.70 (using Claude Opus)

**For 1 video/day:**
- Monthly cost: ~$12-$21
- **ROI:** Exceptional quality vs. mediocre output

---

## 🎯 When to Use Which System

### Use **Single-Agent** (`/`) When:
- Testing ideas quickly
- Don't need maximum quality
- Budget-conscious prototyping
- Just need a draft to iterate on manually

### Use **Multi-Agent** (`/multi-agent`) When:
- Creating your daily premium video
- Quality is paramount
- Want transparency into agent reasoning
- Need confidence in viral potential
- Publishing directly to social media

---

## 🛠️ Environment Variables

```bash
# Required for all systems
ANTHROPIC_API_KEY=sk-ant-...              # Claude API
ELEVENLABS_API_KEY=sk_...                 # Voiceover generation
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Voice selection
REPLICATE_API_TOKEN=r8_...                # B-roll image generation
```

---

## 🚀 Future Enhancements

### Planned Features:
1. **Human Feedback Loop**
   - Inline commenting on scripts
   - "Improve this scene" button
   - Custom revision requests

2. **Agent Performance Analytics**
   - Track which agents excel
   - Average scores over time
   - A/B test different prompts

3. **Multi-Video Batch Mode**
   - Queue 5-10 topics
   - Run overnight
   - Review queue in morning

4. **Custom Agent Personalities**
   - Swap Kurzgesagt style for others
   - Create brand-specific voices
   - Mix and match approaches

5. **Export to Social Platforms**
   - Direct TikTok/Instagram upload
   - Auto-schedule posting
   - Analytics integration

---

## 📞 Support & Documentation

- **Full Master Skill:** `.agent/skills/multi-agent-orchestrator/MASTER_SKILL.md`
- **API Endpoint:** `src/app/api/generate-multi-agent/route.ts`
- **UI Component:** `src/app/multi-agent/page.tsx`

---

## 🎬 Example Output Quality

**Topic:** "Why quantum computers will change everything"

**Quality Scores:**
- Hook Strength: 9/10
- Emotional Arc: 9/10
- Pacing: 8/10
- Kurzgesagt Mechanisms: 9/10
- Clarity: 8/10
- Viral Potential: 9/10

**Overall:** 52/60 ✅ **APPROVED**

**Script Excerpt:**
```
Right now, in a lab somewhere, a computer just did something impossible. 
It calculated in 200 seconds what would take the world's fastest 
supercomputer 10,000 years. And we are completely unprepared for what comes next.

This is not science fiction. This is quantum computing. And it doesn't 
work like anything you know...
```

---

**Built for creators who demand excellence.** 🚀
