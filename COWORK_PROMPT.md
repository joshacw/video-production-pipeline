# Claude Cowork Video Production Orchestration Prompt

This prompt template enables Claude to generate media assets and render videos in a single coordinated workflow.

---

## 🎬 Master Prompt Template

```
I need you to create a complete video production workflow with all assets and rendering.

PROJECT: [Your product/service name]
TEMPLATE: [Choose: pain-solution-cta / feature-showcase / stats-proof / before-after / listicle / testimonial]
DURATION: [15s / 30s / 45s / 60s]
PLATFORM: [youtube-shorts / instagram-reels / tiktok / linkedin]

CONTENT:
- Hook/Pain: [The problem or attention-grabber]
- Solution/Features: [Main points - 2-5 bullet points]
- CTA: [Call to action]

BRANDING:
- Primary Color: [hex code or description]
- Secondary Color: [hex code or description]
- Font Style: [modern / classic / playful / professional]
- Brand Name: [Company name]

ASSETS NEEDED:
- Logo: [Describe the logo style - e.g., "minimalist dental tooth icon in teal"]
- Screenshots: [Describe each - e.g., "dashboard showing patient queue management"]
- Graphics: [Describe icons/illustrations needed]
- Backgrounds: [Describe mood/style]

WORKFLOW:
1. Generate all required media assets
2. Save assets to appropriate folders:
   - Logos → assets/logos/
   - Screenshots → assets/screenshots/
   - Graphics → assets/graphics/
   - Backgrounds → assets/backgrounds/
3. Create video spec JSON following the chosen template
4. Render the video using Remotion

Please execute this full workflow and deliver the final MP4 video.
```

---

## 📋 Example: Complete Workflow Request

### Example 1: SaaS Product Demo

```
I need you to create a complete video production workflow with all assets and rendering.

PROJECT: TimeBuddy - AI-powered time tracking for distributed teams
TEMPLATE: feature-showcase
DURATION: 30s
PLATFORM: linkedin

CONTENT:
- Hook: "Tired of manual time tracking?"
- Features:
  1. Voice notes directly in Slack
  2. AI converts to time entries automatically
  3. Syncs with Jira, Asana, Linear instantly
- CTA: "Start free trial - no credit card needed"

BRANDING:
- Primary Color: #8b5cf6 (purple)
- Secondary Color: #06b6d4 (cyan)
- Font Style: modern
- Brand Name: TimeBuddy

ASSETS NEEDED:
- Logo: Modern clock icon with gradient purple-to-cyan, clean wordmark
- Screenshots:
  1. Slack interface showing voice note being sent
  2. TimeBuddy dashboard with AI processing indicator
  3. Integration screen showing Jira/Asana/Linear logos connected
- Graphics: Small checkmark icons in purple
- Backgrounds: Soft gradient from dark purple to navy

WORKFLOW:
1. Generate all required media assets
2. Save assets to appropriate folders
3. Create video spec JSON following feature-showcase template
4. Render the video using Remotion

Please execute this full workflow and deliver the final MP4 video.
```

### Example 2: Local Business Marketing

```
I need you to create a complete video production workflow with all assets and rendering.

PROJECT: Channel D - Patient education for dental practices
TEMPLATE: pain-solution-cta
DURATION: 15s
PLATFORM: instagram-reels

CONTENT:
- Pain: "Struggling to grow your practice while focused on healing?"
- Solution:
  1. Channel D educates patients in your waiting room
  2. Sparks natural conversations about treatments
  3. You focus on healing, we handle education
- CTA: "Try it free - channeld.com"

BRANDING:
- Primary Color: #0ea5e9 (sky blue)
- Secondary Color: #06b6d4 (cyan)
- Font Style: professional
- Brand Name: Channel D

ASSETS NEEDED:
- Logo: Stylized "D" with dental aesthetic, clean and modern
- Screenshots:
  1. Tablet in waiting room showing patient education video
  2. Dentist having natural conversation with patient
- Graphics:
  - Tooth icon in cyan
  - Conversation bubble icon
  - Heart/healing icon
- Backgrounds: Clean dental office with soft focus

WORKFLOW:
1. Generate all required media assets
2. Save assets to appropriate folders
3. Create video spec JSON following pain-solution-cta template
4. Render the video using Remotion

Please execute this full workflow and deliver the final MP4 video.
```

---

## 🎯 Skill-Specific Prompt Additions

### For Pain-Solution-CTA
Add to your prompt:
```
VISUAL STYLE:
- Bold, high-contrast pain statement
- 2-3 numbered benefits with animated icons
- Color transition from dark (pain) to bright (solution)
- Strong CTA button visual
```

### For Feature Showcase
Add to your prompt:
```
VISUAL STYLE:
- Split screen: screenshot left, text right
- Highlight boxes around key UI elements
- Feature number badges (1, 2, 3...)
- Smooth slide transitions between features
```

### For Stats & Social Proof
Add to your prompt:
```
ASSETS NEEDED:
- Customer logos (3-5 well-known brands)
- Metric icons (users, revenue, time saved, etc.)
- Optional: Customer headshots

STATS TO HIGHLIGHT:
- [Number] [metric] (e.g., "10,000+ users")
- [Number] [metric] (e.g., "$2M saved")
- [Number] [metric] (e.g., "99% satisfaction")
```

### For Before & After
Add to your prompt:
```
ASSETS NEEDED:
- "Before" state screenshots (gray/desaturated)
- "After" state screenshots (colorful/vibrant)
- Transition graphic (arrow, checkmark, or transformation icon)

COMPARISON:
- Before: [Describe pain state]
- After: [Describe improved state]
```

### For Listicle
Add to your prompt:
```
LIST ITEMS:
1. [First tip/step with brief description]
2. [Second tip/step]
3. [Third tip/step]
4. [Fourth tip/step]
5. [Fifth tip/step]

ASSETS NEEDED:
- Icon for each list item
- Optional: Screenshots demonstrating each point
```

### For Testimonial Showcase
Add to your prompt:
```
TESTIMONIALS:
- "[Quote]" - [Name], [Title], [Company]
- "[Quote]" - [Name], [Title], [Company]
- "[Quote]" - [Name], [Title], [Company]

ASSETS NEEDED:
- Customer headshots (professional photos)
- Company logos
- Star rating graphics
```

---

## 🚀 Execution Instructions for Claude

When you receive a request using this prompt format:

### Phase 1: Asset Generation (Use Claude Cowork Browser/Image Tools)
1. **Generate Logo**:
   - Use image generation or find appropriate logo
   - Save to: `assets/logos/[brand-name]-logo.png`
   - Ensure transparent background, min 500px wide

2. **Generate/Source Screenshots**:
   - Create mockup screenshots or source appropriate images
   - Save to: `assets/screenshots/[descriptive-name].png`
   - Ensure min 1920px wide, clean and professional

3. **Generate Graphics/Icons**:
   - Create or source icons matching brand style
   - Save to: `assets/graphics/[icon-name].svg` or `.png`
   - Ensure consistent style across all icons

4. **Generate Backgrounds** (if needed):
   - Create gradient or textured backgrounds
   - Save to: `assets/backgrounds/[description].jpg`
   - Ensure min 1920x1080 resolution

### Phase 2: Video Spec Generation
1. Read the appropriate skill template from `SKILLS.md`
2. Create JSON spec matching `SimpleVideo` format:
```json
{
  "script": {
    "title": "[Title from content]",
    "hook": "[Hook/pain from content]",
    "content": [
      "[First point]",
      "[Second point]",
      "[Third point]"
    ],
    "cta": "[CTA from content]"
  },
  "assets": {
    "logo": "assets/logos/[filename]",
    "screenshot1": "assets/screenshots/[filename]",
    "icon1": "assets/graphics/[filename]"
  },
  "branding": {
    "name": "[Brand name]",
    "colors": {
      "primary": "[hex]",
      "secondary": "[hex]",
      "background": "[hex based on template]",
      "text": "[high contrast hex]"
    },
    "fonts": {
      "primary": "[Google Font name]"
    }
  },
  "timing": {
    "intro": [2-3],
    "content": [duration minus intro minus outro],
    "outro": [2-3]
  }
}
```

3. Save spec to: `/tmp/[project-name]-video.json`

### Phase 3: Rendering
Execute the render command:
```bash
cd /Users/joshwilliams/Tenderboss/tenderboss/video-production
npx remotion render SimpleVideo "[project-name].mp4" \
  --props="$(cat /tmp/[project-name]-video.json)" \
  --codec h264
```

### Phase 4: Delivery
1. Confirm video rendered successfully
2. Report file location
3. Provide brief summary of:
   - Assets created
   - Template used
   - Duration and dimensions
   - Key design choices

---

## 💡 Pro Tips for Prompting

**Be Specific About Branding**:
- ❌ "Make it look professional"
- ✅ "Modern sans-serif font, purple (#8b5cf6) and cyan (#06b6d4), minimalist style"

**Describe Assets Clearly**:
- ❌ "Need a logo"
- ✅ "Geometric tooth icon in teal, modern sans-serif wordmark, transparent background"

**Provide Content Hierarchy**:
- ❌ "Talk about our features"
- ✅ "Hook: [pain point], 3 benefits: [specific benefits], CTA: [specific action]"

**Match Platform to Content**:
- YouTube Shorts: Fast-paced, bold text, vertical
- Instagram Reels: Aesthetic focus, less text, trendy
- LinkedIn: Professional tone, clear value prop, square or horizontal
- TikTok: Energetic, relatable, trend-aware

**Asset Quality Expectations**:
- All images: min 1920px width
- Logos: transparent background (PNG)
- Screenshots: clean UI, no lorem ipsum
- Icons: consistent style within video
- File sizes: under 5MB each

---

## 🎓 Learning Examples

### Minimal Prompt (Claude fills in gaps):
```
Create a 15-second Instagram video for my coffee shop's new loyalty app.
Pain-solution-CTA format. Brown and cream colors. Show app interface.
CTA: "Download now"
```

### Detailed Prompt (Maximum control):
```
[Full template filled out with every detail specified, including exact hex codes,
font choices, specific screenshot descriptions, icon styles, animation preferences]
```

**Best Practice**: Start detailed, then simplify as Claude learns your brand style.

---

## 🔄 Iteration Workflow

If you need revisions:

```
Update the [project-name] video:
- Change primary color to [new hex]
- Replace CTA with "[new CTA text]"
- Add new screenshot showing [description]
- Adjust timing: make intro 3s instead of 2s
```

Claude will:
1. Generate any new assets needed
2. Update the JSON spec
3. Re-render the video
4. Deliver updated MP4

---

## 📚 Reference Files

- **Skills Library**: `/video-production/SKILLS.md`
- **Asset Guidelines**: `/video-production/assets/README.md`
- **Render Script**: `/video-production/scripts/render-spec.sh`
- **Composition Code**: `/video-production/src/remotion/compositions/SimpleVideo.tsx`

---

## ⚡ Quick Start

**Fastest way to get started**:

```
Use the pain-solution-cta template to create a 15-second video for [product].
Pain: [one sentence]
Solution: [3 brief points]
CTA: [clear action]
Brand colors: [primary] and [secondary]
Generate appropriate logo and icons.
```

Claude handles everything else automatically!
