# 🌟 CampusConnect

**CampusConnect** is a vibrant, retro-inspired campus event management portal. It serves as a centralized hub for students to discover, register for, and track college events, while providing admins with a powerful dashboard to manage the campus board.

![CampusConnect Banner](https://raw.githubusercontent.com/royysoans/CampusConnect/main/public/banner.png) *(Note: Replace with actual banner if available)*

## 🎨 Design Philosophy: "The Zine Aesthetic"
CampusConnect breaks away from standard, boring web designs with a **Zine / Bulletin-Board** aesthetic:
- **Rotated Elements**: Cards and headers mimic paper flyers pinned to a board.
- **Vibrant Textures**: Subtle noise overlays and paper backgrounds.
- **Hand-drawn Accents**: Using specialized fonts like *Permanent Marker* and *Special Elite*.
- **Tactile UI**: Heavy shadows and high-contrast borders for a "cut-and-paste" feel.

---

## 🚀 Features

### For Students
- **Event Discovery**: Browse upcoming, ongoing, and past events in a categorized, searchable board.
- **Interactive Calendar**: View the "Master Schedule" using a full-page calendar interface.
- **Easy Registration**: Quick, no-login registration for any event with instant feedback.
- **Master Filters**: Filter by event status (Upcoming/Past) or category (Tech, Cultural, etc.).

### For Admins
- **Secure Dashboard**: Protected admin portal for managing the entire campus board.
- **Event Management**: Create, edit, and delete events with banner uploads via Supabase Storage.
- **Registration Tracking**: View and export student registration data for any event.
- **Live Stats**: At-a-glance metrics for postings and topics.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (using the new JIT engine and `@theme` blocks)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Calendar**: [FullCalendar](https://fullcalendar.io/)

---

## 🔑 Demo Access

To explore the admin features, use the following demo credentials:

> [!IMPORTANT]
> **Admin Portal**: `/admin/login`
> - **Email**: `admin@college.edu`
> - **Secret Phrase**: `admin123` *(or your configured Supabase password)*

---

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/royysoans/CampusConnect.git
   cd CampusConnect
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Database Setup**:
   Run the SQL provided in `supabase-schema.sql` within your Supabase SQL Editor to set up tables, RLS policies, and storage buckets.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Navbar, EventCard, etc.)
│   └── admin/      # Admin-specific components (EventForm, RegistrationViewer)
├── context/        # Auth and Events state management
├── lib/            # Supabase client configuration
├── pages/          # Main page components (HomePage, CalendarPage, etc.)
└── index.css       # Global styles and Zine design tokens
```

---

## 📝 License
This project is for campus use. See local guidelines for contribution and data privacy.

---
Built with ❤️ by the CampusConnect Team.
