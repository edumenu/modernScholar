# Contact Us Page

## Problem Statement

Modern Scholar has a placeholder contact page with no actual UI. Users who want to reach out — whether about scholarships, partnerships, or general inquiries — land on a blank page with a "check back later" message. This undermines trust and blocks a key communication channel.

## Solution

Build a polished, UI-only contact page that matches the Figma design and existing site patterns. The page presents a hero header and a two-column layout with a decorative glassmorphic illustration (left) and a contact form (right). No submission logic — this is a visual/structural foundation that submission handling can be layered onto later.

**Figma reference:** [Contact Us Page](https://www.figma.com/design/jRs5hnBO8JeInjQlI9qKt0/ModernScholar-Styles-components?node-id=929-3702&m=dev)

## User Stories

1. As a visitor, I want to see a well-designed contact page so that I trust the platform is professional and maintained.
2. As a visitor, I want clearly labeled form fields (Name, Email, School Name, Subject, Message) so that I understand what information to provide.
3. As a visitor, I want required fields marked with an asterisk so that I know which fields are mandatory.
4. As a visitor on mobile, I want the page to focus on the form without decorative clutter so that I can quickly find and fill out the contact form.
5. As a visitor on desktop, I want to see the decorative graduation illustration alongside the form so that the page feels visually engaging and on-brand.
6. As a visitor, I want smooth entrance animations as I scroll so that the experience feels polished and consistent with other pages on the site.

## Implementation Decisions

### Page Structure

- Replace the placeholder content in the existing contact page (`src/app/contact/page.tsx`)
- Follow existing page patterns: server component shell with metadata, client component(s) for interactive/animated sections
- Use `page-padding-y` for vertical spacing, consistent with blog and scholarship pages

### Hero Section

- Animated heading using `AnimatedLines` with `font-heading` (Noto Serif), matching the blog hero pattern
- Subtitle in Poppins (`font-sans`), using `text-on-surface-variant` color token
- Wrapped in `AnimatedSection` for entrance animation

### Two-Column Layout

- CSS Grid: single column on mobile, two columns on desktop (`lg:` breakpoint)
- **Left column (desktop only):** Decorative glassmorphic illustration — hidden below `lg:` breakpoint
  - Concentric glassmorphic circles using existing glass panel design tokens (`.glass-panel` equivalent via Tailwind classes: semi-transparent white backgrounds, white borders, backdrop blur, inset shadows)
  - Graduation icon: SVG or Iconify icon centered in the inner circle
  - Two floating emoji bubbles (📚 and 🎓) positioned with absolute positioning, using glass-elevated styling
- **Right column:** Contact form with "Get in Touch" subheading and description

### Form UI

- **Fields:** Name\* (text input), Email Address\* (email input with placeholder), School Name (text input), Subject (text input), Your Message (textarea)
- **Labels:** Uppercase, small text, medium weight, `text-on-surface-variant` — matching Figma's label styling adapted to project typography (Poppins, not Inter)
- **Inputs:** Reuse existing `Input` component with glassmorphic styling override — semi-transparent white background, white border, rounded-xl, inset shadow. Apply consistent styling across all text inputs.
- **Textarea:** Install shadcn `Textarea` component, then adapt its styling to match the glassmorphic `Input` styling. Place in `src/components/ui/textarea/` directory following existing component organization.
- **Submit button:** Use existing `CTAButton` component with "SUBMIT" label. Primary variant.

### Glassmorphic Input Styling

Form inputs should use a frosted glass aesthetic consistent with the Figma design:
- Semi-transparent white background (`bg-white/25`)
- White border with low opacity (`border-white/40`)
- `rounded-2xl` border radius
- Inset shadow for depth (`shadow-[inset_0px_2px_10px_0px_rgba(31,38,135,0.1)]`)
- Standard focus ring from existing Input component

### Animations

- Hero heading: `AnimatedLines` with character reveal (matching blog hero)
- Hero subtitle: `AnimatedSection` with `fadeUp` and slight delay
- Illustration: `AnimatedSection` with `scaleIn` or `fadeLeft`
- Form: `AnimatedSection` with `fadeUp` or `fadeRight`, staggered delay

### Typography Mapping (Figma → Project)

| Figma | Project |
|-------|---------|
| Poppins Bold (hero title) | Noto Serif (`font-heading`) — follows project heading convention |
| Inter Medium (form heading) | Noto Serif (`font-heading`) |
| Inter Regular (body/placeholders) | Poppins (`font-sans`) |
| Inter Medium (labels) | Poppins medium (`font-sans font-medium`) |

### Responsiveness

- **Desktop (lg+):** Two-column grid, illustration visible
- **Tablet/Mobile (<lg):** Single column, illustration hidden, form takes full width
- Form fields are full-width at all breakpoints

### New Dependencies

- `shadcn textarea` — installed via `npx shadcn@latest add textarea`

## Testing Decisions

- **Modules to test:** No unit tests needed — this is a static UI page with no logic, validation, or state management
- **Visual verification:** Manual check against Figma design at desktop and mobile breakpoints
- **Prior art:** Blog page and scholarship page follow the same pattern (hero + content grid) with no dedicated tests

## Out of Scope

- Form validation and error states
- Form submission logic (API routes, server actions)
- Email service integration
- CAPTCHA or rate limiting
- Success/error feedback (toasts, redirects)
- File upload or attachment fields
- Dark mode adjustments for the glassmorphic illustration (can be addressed in a follow-up)
- Storybook stories for new contact components

## Further Notes

- The glassmorphic illustration is purely decorative. Consider adding `aria-hidden="true"` to the entire illustration container for screen reader cleanliness.
- When submission logic is added later, the form will need to become a client component (or use a server action). The current UI-only structure should make that transition straightforward.
- The "Get in Touch" heading and description text can be adjusted — the Figma copy ("Have questions about scholarships? We're here to help you on your educational journey.") is a good starting point.
