# Plan - Vem Pedalar Platform

Building a professional cycling event registration platform with nature-inspired design, public landing page, and protected admin panel.

## Backend & Database (Lovable Cloud)

- Enable Lovable Cloud for persistent storage and authentication.
- Create `registrations` table:
  - `id` (UUID, primary key)
  - `registration_number` (Text, unique, e.g., VEM-0001)
  - `full_name` (Text, not null)
  - `whatsapp` (Text, not null)
  - `birth_date` (Date, not null)
  - `city_neighborhood` (Text, not null)
  - `emergency_contact_name` (Text, optional)
  - `emergency_contact_phone` (Text, optional)
  - `emergency_contact_relation` (Text, optional)
  - `terms_accepted` (Boolean, not null)
  - `status` (Enum: 'registered', 'confirmed', 'checked_in', 'cancelled')
  - `check_in_at` (Timestamp)
  - `created_at` (Timestamp)
- Create `event_settings` table to store dynamic content like dates, emergency field toggles, and terms.
- Setup `user_roles` for admin access.

## Design System (oklch)

- Define a nature-inspired palette in `src/styles.css`:
  - Primary: Sky Blue (oklch)
  - Nature Green (oklch)
  - Energy Yellow (oklch)
  - Earthy Tones (oklch)
- Implement modern UI components: rounded cards, soft shadows, large buttons, and spacing.

## Frontend - Public Area

- **Home Page (`/`)**:
  - Hero: Cyclist on road (Photograph 3) with strong mobile framing.
  - "About" Section: Purpose and experience pillars (Pedal, Nature, Community).
  - Experience Section: Using Photograph 1 (Group) and Photograph 2 (Trail).
  - Event Info: Dynamic display of date/location.
- **Registration Flow (`/inscricao`)**:
  - Mobile-first multi-step or single-column form.
  - Masked WhatsApp input.
  - Conditional emergency contact fields.
  - Required checkbox terms.
  - Success screen with unique registration number.

## Frontend - Admin Area

- **Auth (`/admin/login`)**: Login protection.
- **Dashboard (`/admin`)**: Stats cards (Registered, Confirmed, Check-ins) and evolution chart.
- **Participants List (`/admin/participants`)**:
  - Desktop table, Mobile cards.
  - Search (name, number, phone) and status filters.
  - Detailed view/edit modal.
  - Export to CSV/Excel functionality.
- **Settings (`/admin/settings`)**: Manage event details, emergency field toggle, and terms text.

## Technical Details

- Framework: TanStack Start v1 (React 19).
- Styling: Tailwind CSS v4.
- Icons: Lucide React.
- Validation: Zod.
- Auth: Supabase (managed via Lovable Cloud).
- UI Components: custom Shadcn-inspired components.
