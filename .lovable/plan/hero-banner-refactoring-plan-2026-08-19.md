# Hero Banner Refactoring Plan

Refactor the Hero section to improve visual hierarchy and better frame the background image.

## Proposed Changes

### Hero Section Layout
- Update the section container's background properties to `bg-cover bg-[center_top]` to focus on the cyclist's upper body.
- Adjust the container height to `min-h-[85vh]` on mobile and `min-h-screen` on desktop.
- Refine the overlay gradient to transition from `transparent` at the top to a deep `black` at the bottom, ensuring text contrast without obscuring the cyclist's face.

### Content Repositioning
- Move the main content block (title, badges, description, and button) to the bottom of the hero container using `justify-end` and padding.
- This repositioning ensures the cyclist's face and upper body remain unobstructed.

### Typography & Styling
- Increase the "VEM PEDALAR" title size using `text-5xl sm:text-7xl md:text-9xl` and set it to `font-black`.
- Ensure the title uses appropriate line-height and letter-spacing to prevent cluttered breaks.
- Maintain the tagline bar, description, and primary button styles within the new bottom-aligned layout.

## Technical Details
- Modify `src/routes/index.tsx` to update the Hero section classes and structure.
- Update `bg-gradient-to-b` to `bg-gradient-to-t` with specific stops (`from-black via-black/60 to-transparent`).
- Adjust flexbox properties on the content wrapper to push elements to the bottom (`mt-auto`).
- Validate responsiveness across mobile and desktop viewports.
