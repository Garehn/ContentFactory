---
name: Kurzgesagt Visual B-Roll Generator
description: Ultra-detailed prompt engineering for generating B-roll images in the exact Kurzgesagt visual style using Replicate Flux
version: 1.0
---

# 🎨 KURZGESAGT VISUAL STYLE GUIDE

## CORE AESTHETIC PRINCIPLES

### 1. Color Palette
**Primary Colors:**
- Deep Space Blue: `#0A1128` (backgrounds)
- Vibrant Purple: `#7209B7` (accents, neon outlines)
- Electric Cyan: `#4CC9F0` (highlights, glow effects)
- Warm Orange: `#F77F00` (energy, life, warmth)
- Soft Pink: `#EF476F` (medical, organic elements)

**Secondary/Accent:**
- Lime Green: `#06FFA5` (technology, data)
- Deep Magenta: `#D90368` (danger, intensity)
- Golden Yellow: `#FFD60A` (stars, energy bursts)
- Mint: `#90E0EF` (water, calm elements)

**Rules:**
- Never use pure white backgrounds (always gradients or space)
- Maximum 3-4 colors per scene
- Always include one neon/glow element
- Shadows are DEEP (near-black with slight color tint)

---

### 2. Character Design
**The "Cute" Aesthetic:**
- **Geometric Simplification:** All characters are rounded basic shapes (circles, ovals, rectangles with extreme corner radius)
- **Facial Features:** 
  - Eyes: Simple dots or ovals (black or white)
  - Expressions: Minimal (dots for eyes, curved line for mouth)
  - No pupils, no detailed features
- **Proportions:** Stubby limbs, oversized heads (60% of body size)
- **Outline:** Always 3-5px thick, usually black or dark purple

**Character Types:**
1. **The Bird:** Kurzgesagt's mascot
   - Round body (circle/egg shape)
   - Tiny triangle beak (bright yellow/orange)
   - Stick legs (2-3px lines)
   - Small circular eyes (dots)
   - Optional: Small wings (rounded triangles)

2. **Human Figures:**
   - Pill-shaped body (rounded rectangle)
   - Circular head (slightly smaller than body)
   - Stick limbs (rounded caps)
   - No hands/feet detail (just rounded ends)
   - Height: 1.5-2x width

3. **Cells/Microorganisms:**
   - Blob shapes (organic circles with slight irregularity)
   - Facial expressions (eyes + mouth)
   - Sometimes tentacles/flagella (wavy lines)
   - Often with glow/outline effects

---

### 3. Visual Metaphors & Composition

**Scale Techniques:**
1. **Micro to Macro:**
   - Zoom progression (cell → organ → body → planet → universe)
   - Size comparison overlays (Earth = basketball, virus = pixel)

2. **Cutaway Diagrams:**
   - Cross-sections showing "inside" views
   - Transparent outer shells revealing inner workings
   - Label lines with rounded caps

3. **Grid/Pattern Backgrounds:**
   - Hexagonal grids (technology, organization)
   - Dot matrices (space, vastness)
   - Concentric circles (waves, impact zones)

**Lighting & Glow Effects:**
- **Rim Lighting:** Characters have bright outline on one side
- **Neon Glow:** Important elements have soft glow aura (10-20px blur)
- **Volumetric Rays:** Light beams with slight transparency
- **Particle Effects:** Floating dots, stars, energy clusters

---

### 4. Typography & Labels
- **Font Style:** Sans-serif, bold, all-caps for emphasis
- **Label Lines:** Curved with rounded endpoints
- **Numbers:** Large, prominent, often with glow
- **Emphasis:** Yellow highlight boxes with rounded corners

---

## ANIMATION-READY VISUAL CUES

### Scene Type Templates

#### **TEMPLATE 1: SPACE/COSMIC SCENE**
```
Prompt Structure:
"[Subject] floating in deep purple space gradient (hex #0A1128 to #7209B7), 
surrounded by [number] small glowing stars (yellow and cyan dots), 
[perspective element] shown in cutaway/transparent style, 
neon purple (#7209B7) outline with cyan (#4CC9F0) glow effect, 
flat vector illustration, Kurzgesagt animation style, 
16:9 aspect ratio, no text, clean geometric shapes"
```

**Example:**
```
Cute vector bird character (round orange body, tiny yellow beak, dot eyes) 
floating in deep purple space gradient, surrounded by 200 small glowing stars, 
Earth visible in background (50% size), bird has confused expression (tilted head), 
neon purple outline with cyan glow, flat vector, Kurzgesagt style, 16:9
```

---

#### **TEMPLATE 2: BIOLOGICAL/MEDICAL SCENE**
```
Prompt Structure:
"Cross-section view of [biological structure] in [vibrant color], 
[cute character version] of [cells/organisms] with facial expressions, 
[action happening], background: soft gradient [color 1] to [color 2], 
neon outlines, geometric simplified shapes, Kurzgesagt medical illustration style, 
isometric perspective, 16:9"
```

**Example:**
```
Cross-section of human bloodstream (pink #EF476F interior), 
cute blob-shaped white blood cells (round with tiny eyes and mouth) 
attacking spiky virus particles (dark purple with cyan spikes), 
cells have determined facial expressions, yellow explosion effects, 
background: soft pink to deep red gradient, neon white outlines, 
Kurzgesagt medical style, isometric view, 16:9
```

---

#### **TEMPLATE 3: TECHNOLOGY/DATA SCENE**
```
Prompt Structure:
"[Tech element] visualized as geometric network of [shape] connected by [line] type],
[character] interacting with [data visualization],
color palette: [tech colors - cyan, lime green, purple],
hexagonal grid background, holographic glow effects,
Kurzgesagt infographic style, flat design, 16:9"
```

**Example:**
```
Neural network visualized as interconnected neon nodes (cyan #4CC9F0 circles) 
connected by glowing purple lines, cute vector human figure (pill-shaped) 
touching central node, data streams flowing (animated particle trails), 
hexagonal grid background (#0A1128), holographic cyan glow, 
Kurzgesagt tech style, flat vector, 16:9
```

---

#### **TEMPLATE 4: SCALE COMPARISON**
```
Prompt Structure:
"Size comparison of [large object] vs [small object], 
[large] shown as [geometric shape] with [details],
[small] shown as [tiny element] with [visual indicator],
arranged [spatially], measurement lines/labels implied,
background: [simple gradient], Kurzgesagt educational diagram style, 16:9"
```

**Example:**
```
Size comparison of Sun (large golden yellow sphere, right side) 
vs Earth (tiny blue-green dot, left side with arrow pointing to it), 
dotted line connecting them, cute shocked bird character for scale (middle), 
background: deep space purple gradient, measurement aesthetic, 
Kurzgesagt science diagram style, flat vector, 16:9
```

---

#### **TEMPLATE 5: PROCESS/TIMELINE**
```
Prompt Structure:
"Sequential diagram showing [process] in [number] stages, 
stage 1: [description], stage 2: [description], stage 3: [description], 
connected by [arrows/lines with style], 
each stage has [cute character representation],
color progression from [start color] to [end color],
Kurzgesagt process diagram style, horizontal layout, 16:9"
```

**Example:**
```
Evolution timeline showing 4 stages: 
(1) primordial soup (blob with bubbles), 
(2) single cell (cute circle with flagella), 
(3) fish (simplified geometric fish), 
(4) human (pill-shaped figure), 
connected by curved arrows with glow effect, 
color progression purple to orange, timeline at bottom, 
Kurzgesagt evolution diagram, flat vector, 16:9
```

---

#### **TEMPLATE 6: EXPLOSION/IMPACT**
```
Prompt Structure:
"[Central event] shown as [geometric burst pattern],
[character] witnessing/experiencing [event],
explosion rays: [color] with [glow type],
particle effects: [description],
background: [before/after or gradient],
Kurzgesagt dramatic moment style, radial composition, 16:9"
```

**Example:**
```
Gamma ray burst (central point) creating radial explosion pattern 
(purple and cyan rays emanating outward), cute duck character (orange, round body) 
being vaporized (dissolving into particles), 
yellow and white energy bursts, particle trail effects, 
background: space gradient from deep purple to bright cyan, 
Kurzgesagt cosmic event style, dramatic composition, 16:9
```

---

## DETAILED KEYWORD LIBRARY

### Characters & Objects
- "cute vector bird" / "round blob character" / "pill-shaped human"
- "geometric simplified [object]" / "low-poly [object]"
- "with facial expression (dots for eyes, curved line mouth)"
- "stubby limbs" / "stick arms and legs" / "rounded caps"

### Effects & Lighting
- "neon outline (purple/cyan/pink)" / "soft glow aura"
- "volumetric light rays" / "particle trail system"
- "holographic shimmer" / "rim lighting effect"
- "transparency with inner glow" / "radial blur"

### Backgrounds
- "deep space gradient (purple to blue)"
- "hexagonal grid pattern overlay"
- "dot matrix starfield"
- "soft bokeh circles background"
- "isometric grid floor"

### Composition
- "isometric perspective" / "cutaway cross-section"
- "radial composition" / "rule of thirds focal point"
- "layered depth (foreground/midground/background)"
- "zoomed out cosmic scale" / "microscopic close-up"

### Technical Specs (Always Include)
- "flat vector illustration"
- "Kurzgesagt animation style" / "Kurzgesagt – In a Nutshell visual style"
- "16:9 aspect ratio"
- "no text, no labels, clean design"
- "vibrant color palette"
- "geometric simplified shapes"

---

## JUXTAPOSITION RULES (Kurzgesagt Signature)

**Principle:** Pair cute aesthetic with existentially heavy/violent content

**Examples:**
1. **Cute + Deadly:**
   - "Smiling cell commits suicide (apoptosis) by dissolving, happy facial expression"
   - "Adorable neutrophil blob vomits acid, cheerful eyes"

2. **Small + Cosmic:**
   - "Tiny confused bird floating in infinite void, looking at colliding galaxies"
   - "Happy human figure waves at dying star, oblivious to scale"

3. **Simple + Complex:**
   - "Single geometric shape contains entire universe simulation, simplified exterior"

---

## PROMPT ENHANCEMENT FORMULA

**Base Prompt:**
```
[Character/Subject description] + [Action/State] + [Environment/Background] + 
[Color Palette specifics] + [Lighting/Effects] + [Style keywords] + [Technical specs]
```

**Enhanced Example:**
```
Cute vector bird character (round orange body, stubby wings, dot eyes, small yellow beak)
floating in deep purple-to-blue space gradient background (#0A1128 to #4361EE),
surrounded by 300 tiny glowing stars (yellow and cyan dots with soft glow),
bird has confused tilted-head expression,
neon purple outline (3px thick) with cyan glow aura (15px blur),
volumetric light ray from top-right corner,
flat vector illustration, Kurzgesagt - In a Nutshell animation style,
geometric simplified shapes, vibrant color palette,
16:9 aspect ratio, no text, clean minimalist design
```

---

## NEGATIVE PROMPTS (What to AVOID)

```
realistic, photorealistic, 3D render, detailed textures, 
complex shading, gradient mesh, realistic lighting,
human proportions, anatomically correct, detailed faces,
cluttered composition, multiple fonts, watermarks,
dull colors, muted palette, earth tones only,
sketch style, hand-drawn, painterly
```

---

## ASPECT RATIO & RESOLUTION SPECS

**For Replicate Flux:**
- **Aspect Ratio:** 16:9 (standard)
- **Alternative:** 9:16 (vertical for shorts)
- **Output Format:** PNG (high quality)
- **Output Quality:** 90-100

---

## USAGE INSTRUCTIONS

### For Each Scene's Visual Cue:

1. **Identify Scene Category:** (Space, Biology, Tech, Scale, Process, Impact)
2. **Select Template:** Use corresponding template from above
3. **Insert Specific Details:**
   - Replace `[Subject]` with cute character description
   - Replace `[Action]` with what's happening
   - Specify exact colors using hex codes
   - Add juxtaposition element (cute + serious)

4. **Apply Enhancement Formula:**
   - Character details
   - Environment
   - Color palette
   - Effects
   - Style keywords
   - Technical specs

5. **Add Negative Prompt:**
   - Include all "avoid" keywords

### Example Transformation:

**Original Visual Cue:** "Neon outline of cell"

**Enhanced for Flux:**
```
Prompt: "Cute blob-shaped cell character (round pink body #EF476F, tiny dot eyes, 
smiling curved mouth) with neon cyan outline (5px thick, #4CC9F0), soft glow aura 
around edges (20px blur), floating in deep purple space gradient background, 
small particle effects surrounding cell, flat vector illustration, 
Kurzgesagt medical animation style, geometric simplified design, 
vibrant color palette, 16:9 aspect ratio, no text"

Negative: "realistic, 3D, detailed texture, complex shading, photorealistic, 
cluttered, dull colors"
```

---

**This system ensures every B-roll image perfectly matches Kurzgesagt's signature aesthetic while being animation-ready and visually striking.**
