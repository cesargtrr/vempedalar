# Plan - CSS Refactoring and UI Polish for Vem Pedalar

Refactor and adjust the CSS of the registration form page to fix alignment and spacing issues while maintaining the existing dark "mountain bike" aesthetic (Lime Green / Black / Earth Brown).

## Technical Details

### 1. Global Box-Sizing and Responsiveness
- Ensure `box-sizing: border-box` is applied globally in `src/styles.css`.
- Audit margins and paddings for mobile overflow issues.

### 2. Benefits Grid (Highlights Section)
- **File:** `src/routes/index.tsx`
- Refactor the grid items in the highlights section.
- Change layout so the green icon is aligned to the left of its title and subtitle.
- Ensure vertical center alignment within each highlight item.
- Optimize the 2x2 grid for mobile.

### 3. Photo Gallery Grid
- **File:** `src/routes/index.tsx`
- Apply `aspect-ratio` or `object-fit: cover` to images in the Pinterest/bento grid to prevent stretching.
- Ensure consistent spacing between grid items.

### 4. Registration Form Refinement
- **File:** `src/components/RegistrationForm.tsx`
- **Input Grid:** Adjust input layout to a structured grid (e.g., Name/Date of Birth row, Phone/City row on desktop).
- **Terms Checkboxes:** Align checkboxes to the left of the text with consistent vertical spacing.
- **Submit Button:** Add hover states and center the button.

### 5. Contrast and Legibility
- Review and ensure high contrast for better readability.

## User Review Required

> [!IMPORTANT]
> The refactoring focuses on layout stability (CSS) and minor HTML structure changes to support better alignment. No new functionality will be added.
