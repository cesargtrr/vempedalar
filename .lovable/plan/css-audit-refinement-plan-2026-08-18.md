# CSS Audit & Refinement Plan

Conduct a comprehensive CSS audit and refactor to fix alignment, responsiveness, and visual consistency issues across the Vem Pedalar platform.

## Proposed Changes

### Global Styling (src/styles.css)
- Implement a more robust container system to prevent content from touching screen edges on mobile.
- Refine the custom utility classes for "diagonal-cut" to ensure they are consistent across all components.
- Add smooth scroll-margin-top to sections to account for the sticky header.

### Header (src/routes/index.tsx)
- Standardize the header height across breakpoints (h-16 md:h-20).
- Optimize the logo and button alignment to ensure perfect vertical centering.
- Refine the "INSCREVA-SE" button's `clip-path` and padding to prevent any text clipping on smaller screens.

### Hero Section (src/routes/index.tsx)
- Adjust the Hero padding to ensure it starts exactly below the header.
- Refine the typography scaling for the main title to avoid overlapping or extreme sizes on mobile.

### Registration Form (src/components/RegistrationForm.tsx)
- **Input Alignment:** Ensure all icons in labels are perfectly aligned with the text.
- **Form Grid:** Optimize the 2-column layout on desktop to handle varying screen widths gracefully.
- **Checkbox/Terms:** Refine the custom checkbox styling to ensure the checkmark is perfectly centered and the text alignment remains consistent even for multi-line terms.
- **Success State:** Standardize the confirmation card styling to match the rest of the dark/neon theme.

### UI Consistency
- Audit all hover states to ensure they follow the established pattern (translate-x-1 hover:-translate-y-1).
- Check color usage to ensure all elements use the semantic variables defined in `@theme`.

## Technical Details
- Use `scroll-pt-20` on the root container for offset scrolling.
- Apply `leading-none` or specific `line-height` values to Anton font elements to prevent vertical clipping caused by italic/uppercase rendering.
- Ensure all images have explicit `aspect-ratio` where appropriate to prevent layout shifts.
