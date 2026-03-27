# Design System: High-End Editorial Specification

## 1. Overview & Creative North Star: "The Sun-Drenched Sanctuary"
This design system moves beyond the "cute" to the "curated." It rejects the sterile, rigid grids of utility apps in favor of a **Marshmallow-Soft Editorial** aesthetic. 

**The Creative North Star: The Sun-Drenched Sanctuary.**
The interface should feel like a physical, high-end paper diary resting on a sunlit wooden table. We achieve this through "Visual Squishability"—the use of extreme corner radii (32px), organic layouts, and the total abolition of harsh structural lines. We break the "template" look by using intentional white space as a structural element, allowing cards to float and overlap like loose-leaf polaroids.

---

## 2. Colors & Surface Philosophy
The palette is rooted in warmth, replacing digital greys with `on-surface` browns (#383831) and `surface` creams (#FEFCF1).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through:
1.  **Background Color Shifts:** A `surface-container-low` (#FBFAEE) card sitting on a `surface` (#FEFCF1) background.
2.  **Tonal Transitions:** Using the `surface-container` tiers to create hierarchy.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. To create depth, stack tiers:
*   **Base Layer:** `surface` (#FEFCF1)
*   **Section Layer:** `surface-container-low` (#FBFAEE)
*   **Active/Card Layer:** `surface-container-lowest` (#FFFFFF)
*   **Nesting:** If a card contains a sub-element (like a mood tag), use `surface-container-high` (#F0EEE1) for that tag to "sink" it into the card.

### The "Glass & Gradient" Rule
For floating action buttons or modal overlays, use **Glassmorphism**. Apply a semi-transparent `surface` color (80% opacity) with a `20px` backdrop-blur. 
*   **Signature Textures:** Use a subtle linear gradient on primary CTAs: `primary_fixed` (#F9CC61) to `primary` (#7F6000) at a 135° angle. This adds a "glow" that flat colors lack.

---

## 3. Typography: The Rounded Narrative
We utilize **M PLUS Rounded 1c** to maintain a "soft-touch" feel while using extreme weight contrast for editorial impact.

| Level | Weight | Size | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Display-LG** | 800 | 3.5rem | -0.02em | Hero dates, mood summaries. |
| **Headline-MD** | 800 | 1.75rem | -0.01em | Diary entry titles. |
| **Title-MD** | 800 | 1.125rem | 0 | Card headers. |
| **Body-LG** | 500 | 1.0rem | 0.01em | Primary diary text (maximum readability). |
| **Label-MD** | 800 | 0.75rem | 0.05em | Uppercase metadata/tags. |

**Editorial Note:** Always pair a heavy weight (800) for headers with a medium weight (500) for body text. The heavy headers act as visual anchors in a borderless layout.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "digital." We use **Ambient Shadows** and **Tonal Stacking**.

*   **Ambient Shadows:** For "Floating" elements (e.g., the Daily Prompt card), use a tinted shadow: `box-shadow: 0 12px 24px rgba(255, 209, 102, 0.15)`. The yellow tint mimics the warmth of a sunlit page.
*   **The Layering Principle:** Avoid elevation levels 3-5. Keep everything close to the "paper." Depth is achieved by placing a `#FFFFFF` card on a `#F6F4E7` container.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use `outline_variant` (#BBBAB0) at **15% opacity**. Never use 100% opaque lines.
*   **Micro-Skeuomorphism:** Icons should feature a subtle `inner-shadow` (1px, 20% opacity `on-surface-variant`) to look embossed into the soft surface.

---

## 5. Components & Primitives

### Buttons: The Marshmallow CTA
*   **Primary:** `radius: 24px`. Background: `primary_fixed` gradient. Text: `on_primary_fixed` (#443100).
*   **Secondary:** `radius: 24px`. Background: `secondary_container` (#FFC882).
*   **Interaction:** On hover, the button should "squish" (scale 0.98) and the shadow should increase in blur, not darkness.

### Mood Clusters (Custom Component)
Instead of a list, moods are presented in a "Cloud."
*   **Selection:** Use a 32px radius for each mood chip.
*   **Active State:** When selected, a mood chip uses `tertiary_container` (#F99681) with a micro-skeuomorphic inner glow to appear "pressed" into the screen.

### Cards & Lists
*   **Constraint:** No divider lines between list items. 
*   **Separation:** Use `spacing.4` (1.4rem) vertical gaps.
*   **Layout:** Group related items into a single container with a `32px` radius. Use `surface-container-low` to group content clusters.

### Input Fields
*   **Style:** "Pill-shaped" (999px radius) for single lines; 32px radius for text areas.
*   **Fill:** Use `surface_container_highest` (#EAE9DB) with no border.
*   **Focus State:** A soft 4px "halo" using `primary_fixed` at 30% opacity.

---

## 6. Do's and Don'ts

### Do:
*   **Use Intentional Asymmetry:** Let cards be slightly different widths or staggered in a masonry layout to feel like a scrapbooked diary.
*   **Embrace the "Squish":** Ensure every corner is at least 16px (sm) or 32px (lg).
*   **Check Contrast:** Ensure `on_surface` (#383831) is used for all long-form reading to prevent eye strain against the cream background.

### Don't:
*   **Don't use 0px or 4px radii.** It breaks the "Marshmallow" promise.
*   **Don't use pure black (#000000).** It is too aggressive for this palette. Use `on_surface` or `on_background` only.
*   **Don't use standard Material dividers.** If you need to separate content, use a wider gap (`spacing.6`) or a subtle change in background tone.