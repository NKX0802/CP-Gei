<div align="center">

# 🏢 FlexiBook
### A campus facility booking app — reserve rooms, courts, and equipment, then check in by scanning your booking's QR code at the on-site kiosk.

🔗 **[Live Demo](https://flexibook-opal.vercel.app)**

<br>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-20232A?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)

</div>

---

## 📖 About

FlexiBook is a web app that lets campus users browse and reserve shared facilities — think study rooms, sports courts, and equipment — without the back-and-forth of emailing an admin. Once a booking is confirmed, users get a generated QR code, which is scanned by a check-in kiosk/scanner at the facility to confirm arrival. Admins get a dashboard with charts to manage requests, availability, and usage.

Built with Next.js (Pages Router) and a MySQL database hosted on TiDB Cloud, with JWT-based auth and image uploads for facilities via Vercel Blob. Pages use skeleton loaders while data is fetched, for a smoother loading experience.

---

## ✨ Features

- 🏢 **Browse facilities** — View available rooms, sports courts, and equipment, complete with images and capacity
- 📆 **Book a slot** — Reserve a time slot for a group size of your choice, with the option to cancel (and log a reason)
- ⭐ **Favourites** — Save facilities you book often for quick access
- 🖥️ **Kiosk check-in** — Each booking gets a unique QR code. Guests scan it at the kiosk (`html5-qrcode`) to check in.
- 🚫 **No-show tracking** — Bookings that go unattended can be flagged as no-shows
- 🔔 **In-app notifications** — Users receive notifications (e.g. booking updates, admin announcements) with read/unread status
- 🖼️ **Facility images** — Admins upload photos of facilities, stored via Vercel Blob
- 📊 **Admin dashboard** — Approve, reject, or manage bookings, with usage charts powered by Recharts
- 🔐 **Secure login** — JWT cookie-based authentication with `bcryptjs` password hashing
- 🍞 **Toast feedback** — Instant UI feedback on actions via `react-hot-toast`
- 💀 **Skeleton loading** — Pages show skeleton placeholders while data loads, instead of blank screens or spinners
- 🎨 **Consistent icons** — UI icons throughout via `lucide-react`
- 📱 **Responsive** — Works smoothly on both phone and desktop

---

## 🧱 Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js (**Pages Router**, not App Router) | 16.2.6 |
| UI library | React / React DOM | 19.2.4 |
| Styling | Tailwind CSS | v4 |
| Database | MySQL on TiDB Cloud, via `mysql2` | 3.22.4 |
| Auth | JWT cookies via `jose` + `bcryptjs` for password hashing | jose 6.2.3, bcryptjs 3.0.3 |
| File storage | Vercel Blob (facility images) | 2.5.0 |
| QR codes | `qrcode` (generate) + `html5-qrcode` (scanned by check-in kiosk) | 1.5.4 / 2.3.8 |
| Charts | Recharts (admin dashboard) | 3.8.1 |
| Icons | lucide-react | 1.17.0 |
| Notifications (UI) | react-hot-toast | 2.6.0 |
| Deployment target | Vercel | — |

---

## 🗄️ Database Schema

The app is backed by a MySQL database (hosted on TiDB Cloud, accessed via `mysql2`) with the following tables:

### `users`

| Column | Type | Null | Key | Default |
|--------|------|------|-----|---------|
| `user_id` | int | NO | PRI | — |
| `user_name` | varchar(100) | NO | | — |
| `user_email` | varchar(150) | NO | UNI | — |
| `user_password` | varchar(255) | NO | | — |
| `user_role` | varchar(10) | NO | | `user` |
| `user_created_at` | datetime | YES | | `CURRENT_TIMESTAMP` |

### `facilities`

| Column | Type | Null | Key | Default |
|--------|------|------|-----|---------|
| `facility_id` | int | NO | PRI | — |
| `facility_name` | varchar(100) | NO | | — |
| `facility_capacity` | int | NO | | — |
| `facility_type` | varchar(50) | YES | | — |
| `facility_description` | text | YES | | — |
| `facility_image_url` | varchar(255) | YES | | — |
| `facility_status` | varchar(10) | NO | | `open` |

### `bookings`

| Column | Type | Null | Key | Default |
|--------|------|------|-----|---------|
| `booking_id` | int | NO | PRI | — |
| `user_id` | int | NO | | — |
| `facility_id` | int | NO | | — |
| `booking_date` | date | NO | | — |
| `booking_time_slot` | varchar(20) | NO | | — |
| `booking_group_size` | int | NO | | — |
| `booking_status` | varchar(15) | NO | | `booked` |
| `booking_cancel_reason` | varchar(255) | YES | | — |
| `booking_created_at` | datetime | YES | | `CURRENT_TIMESTAMP` |
| `checked_in_at` | datetime | YES | | — |
| `no_show_marked_at` | datetime | YES | | — |
| `checkin_token` | varchar(255) | YES | UNI | — |

> `checkin_token` is the value encoded into each booking's QR code, which the check-in kiosk reads to mark `checked_in_at`.

### `favourites`

| Column | Type | Null | Key | Default |
|--------|------|------|-----|---------|
| `favourite_id` | int | NO | PRI | — |
| `user_id` | int | NO | | — |
| `facility_id` | int | NO | | — |

### `notifications`

| Column | Type | Null | Key | Default |
|--------|------|------|-----|---------|
| `notification_id` | int | NO | PRI | — |
| `user_id` | int | NO | | — |
| `title` | varchar(150) | NO | | — |
| `message` | text | NO | | — |
| `notification_type` | varchar(50) | YES | | `general` |
| `is_read` | tinyint(1) | YES | | `0` |
| `created_by` | int | YES | | — |
| `created_at` | datetime | YES | | `CURRENT_TIMESTAMP` |

> 🔒 Access is scoped so users can only view and manage their own bookings, while admins have visibility across all facilities and bookings.

---

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [TiDB Cloud](https://tidbcloud.com/) (or any MySQL-compatible) database instance
- A [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store for facility image uploads

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/NKX0802/FlexiBook.git
   cd FlexiBook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see Configuration below)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3000`

---

## ⚙️ Configuration

Create a `.env` (or `.env.local`) file in the root folder and add the following:

```env
# MySQL / TiDB Cloud connection
DATABASE_HOST=your_tidb_host
DATABASE_PORT=4000
DATABASE_USER=your_tidb_user
DATABASE_PASSWORD=your_tidb_password
DATABASE_NAME=your_database_name

# JWT auth
JWT_SECRET=your_jwt_secret

# Vercel Blob (facility image storage)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

> ⚠️ **Never commit your `.env` file to GitHub.** Make sure it's listed in your `.gitignore`.

---

## 🚸 How to Use

1. **Sign up / Sign in** to your account
2. **Browse facilities** — search for available rooms, courts, or equipment, and save favourites for quick access
3. **Book a slot** — pick a date, time slot, and group size, then confirm your reservation
4. **Get your QR code** — generated automatically for each booking
5. **Check in** — present the QR code to the check-in machine/kiosk at the facility to confirm arrival
6. **Stay updated** — check your notifications for booking updates and announcements
7. **Admins** can log in to manage facilities, approve/reject bookings, mark no-shows, and monitor usage via charts on the dashboard

---

## 🐛 Future Improvements

- 📧 **Email/push reminders** — Notify users before a booking starts, beyond in-app notifications
- 📊 **Deeper usage analytics** — More granular insights into facility usage trends for admins
- ♻️ **Recurring bookings** — Reserve the same slot weekly for recurring activities
- ⭐ **Ratings & feedback** — Let users rate facilities after use

---

## 📜 License

This project is licensed under the MIT License — feel free to use and modify it.
