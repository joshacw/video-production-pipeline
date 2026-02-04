# Video Production Skills Library

This document defines reusable video composition patterns for consistent, high-quality output.

## 📁 Asset Management

### **Asset Folders:**
```
video-production/
├── assets/
│   ├── logos/           # Brand logos (PNG with transparency)
│   ├── screenshots/     # Product screenshots, UI captures
│   ├── graphics/        # Icons, illustrations, decorative elements
│   ├── backgrounds/     # Background images, patterns, textures
│   └── footage/         # Stock video clips, b-roll
```

### **Usage in Videos:**
Reference assets in your video spec:
```json
{
  "assets": {
    "logo": "assets/logos/channel-d-logo.png",
    "screenshot1": "assets/screenshots/dashboard.png",
    "icon": "assets/graphics/tooth-icon.svg"
  }
}
```

---

## 🎬 Skill Templates

### **1. Pain-Solution-CTA** (15-30s)
**Best for:** Product introductions, service pitches
**Structure:**
- Intro (2-3s): Bold title + pain point
- Content (60%): Solution with 2-3 benefits
- Outro (2-3s): Strong CTA

**Visual Style:**
- Numbered benefits with animated icons
- Bold typography for pain point
- Smooth fade transitions
- Color-coded sections (pain=dark, solution=bright)

**Example Prompt:**
> "Use pain-solution-CTA. Target: dental practice owners. Pain: Can't grow while focused on healing. Solution: Channel D educates patients in waiting room. Benefits: Spark conversations, natural upselling, focus on healing. CTA: Try free. 15s. Montserrat font, teal (#0ea5e9) branding."

---

### **2. Feature Showcase** (30-60s)
**Best for:** Product demos, feature highlights
**Structure:**
- Intro (3s): Product name + tagline
- Features (5-7s each): 3-5 features with screenshots
- Outro (3s): CTA

**Visual Style:**
- Split screen: screenshot left, text right
- Smooth slide transitions between features
- Highlight boxes around UI elements
- Feature icons in brand colors

**Assets Needed:**
- Product screenshots (1 per feature)
- Feature icons
- Product logo

---

### **3. Stats & Social Proof** (15-30s)
**Best for:** Building credibility, showing traction
**Structure:**
- Intro (2s): Hook question
- Stats (3-4s each): 3-4 impressive numbers
- Outro (3s): CTA

**Visual Style:**
- Large animated numbers (count-up effect)
- Icons representing each metric
- Customer logos as social proof
- Testimonial quotes

**Assets Needed:**
- Customer logos
- Metric icons
- Optional: customer photos

---

### **4. Before & After** (20-40s)
**Best for:** Transformations, problem-solving
**Structure:**
- Before (40%): Show the pain/problem
- Transition (10%): Your solution appears
- After (40%): Show improved state
- Outro (10%): CTA

**Visual Style:**
- Split screen or side-by-side comparison
- Gray/desaturated "before"
- Colorful/vibrant "after"
- Arrow or transition graphic between states

**Assets Needed:**
- "Before" screenshots
- "After" screenshots
- Transition graphic (arrow, checkmark)

---

### **5. Listicle** (30-60s)
**Best for:** Tips, steps, educational content
**Structure:**
- Intro (3s): Title (e.g., "5 Ways to...")
- Items (5-8s each): Each tip/step
- Outro (3s): CTA

**Visual Style:**
- Large numbers (1, 2, 3...)
- Each item gets full screen focus
- Progress bar at bottom
- Icons or graphics for each point

**Assets Needed:**
- Icons for each list item
- Optional: screenshots demonstrating each point

---

### **6. Testimonial Showcase** (20-40s)
**Best for:** Customer success stories, reviews
**Structure:**
- Intro (3s): "What customers say..."
- Testimonials (5-8s each): 2-3 customer quotes
- Outro (3s): CTA

**Visual Style:**
- Customer photo + name + title
- Quote in large, readable text
- Star ratings
- Company logo
- Soft background blur

**Assets Needed:**
- Customer photos (headshots)
- Company logos
- Optional: product in use screenshots

---

## 🎨 Universal Design Principles

### **Typography Rules:**
- **Title**: 72-96px, bold weight
- **Body**: 36-48px, medium weight
- **CTA**: 56-72px, bold weight
- **Labels**: 24-32px, regular weight

### **Color Usage:**
- **Background**: Dark (#0f172a) or light (#f9fafb)
- **Primary**: Brand main color (headings, CTAs)
- **Secondary**: Brand accent (icons, highlights)
- **Text**: High contrast (#ffffff on dark, #111827 on light)

### **Animation Timing:**
- **Fade in**: 0.3-0.5s
- **Slide**: 0.4-0.6s
- **Scale/bounce**: 0.2-0.4s
- **Hold time**: 2-4s per scene

### **Platform Optimizations:**
- **YouTube Shorts**: 1080x1920, fast-paced, bold text
- **Instagram Reels**: 1080x1920, aesthetic focus, minimal text
- **TikTok**: 1080x1920, energetic, trend-aware
- **LinkedIn**: 1080x1080 or 1920x1080, professional tone
- **Twitter/X**: 1080x1080, punchy, text-heavy

---

## 📝 How to Use These Skills

### **Step 1: Choose a Skill**
Pick the template that matches your goal

### **Step 2: Gather Assets**
Place images in the appropriate asset folder:
```bash
cp my-logo.png assets/logos/
cp dashboard.png assets/screenshots/
```

### **Step 3: Write Your Prompt**
Tell Claude:
- Which skill to use
- Your specific content
- Asset file names
- Brand colors & font
- Duration

### **Step 4: Generate & Render**
Claude creates the JSON spec and renders the video automatically

---

## 🚀 Example Workflow

**Prompt:**
> "Use Feature Showcase skill. Product: TimeBuddy. Features: (1) Voice notes in Slack [screenshot: voice-note.png], (2) AI converts to actions [screenshot: ai-processing.png], (3) Auto-updates tools [screenshot: integrations.png]. Use Poppins font, purple (#8b5cf6) branding. Logo: timebuddy-logo.png. 30 seconds."

**Claude:**
1. ✅ Validates assets exist
2. ✅ Generates optimized spec
3. ✅ Renders video with your assets
4. ✅ Returns MP4 file

---

## 💡 Pro Tips

**Asset Quality:**
- Use PNG for transparency (logos, icons)
- Min 1920px width for screenshots
- Keep file sizes under 5MB
- Use consistent naming (lowercase, hyphens)

**Messaging:**
- Keep text under 12 words per scene
- Front-load the value proposition
- Use action verbs in CTAs
- Match tone to platform

**Branding:**
- Stick to 2-3 colors max
- Use one font family (2 weights max)
- Consistent logo placement
- White space is your friend

---

## 🎯 Coming Soon

- **Animated Explainer**: Illustrated explanations
- **Comparison**: Your product vs competitors
- **Tutorial**: Step-by-step walkthroughs
- **Announcement**: Product launches, updates
- **Story**: Narrative-driven content
