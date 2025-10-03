
# 🍝 Mare Oliva

A restaurant table booking app built with **React + TypeScript (Vite)** and a **Minimal API backend (.NET)** with **SQLite**.  
The app supports authentication, protected routes, full CRUD for bookings ane menu, responsive design, and time-slot handling within restaurant opening hours.
ech Stack

Frontend: React 18, TypeScript, Vite, React Router, React Bootstrap

Backend: .NET Minimal API, SQLite

Database: SQLite with at least 3 tables (users, bookings, roles/view user_bookings)

Architecture: Custom hook (useBookings), utilities for time-slot handling (buildTimeSlots, isValidSlot)

## ✨ Features

* Book a table by selecting date and time within restaurant opening hours

* View my bookings (filtered by logged-in user)

* Admin page with list and edit/delete for all bookings
  
* Admin can access an editform when clicking on the menu item in menu (admin only)

* Protected routes: My Page (user), Admin (admin only)

* Custom hook for API handling (useBookings)

* Time slots validated against opening hours (18–23, 20-minute intervals)

### ✅ Requirements Fulfilled

Base Requirements (G)

 React with TypeScript (Vite)

 Minimal API backend (.NET)

 SQLite with at least 3 tables

 Git with regular commits

 CRUD for resource bookings and menu_items

 Responsive design (mobile/tablet/desktop)

 Custom hook: useBookings

 React Router for navigation

 Correct REST usage (GET/POST/PUT/DELETE)

 Bootstrap/React Bootstrap for styling

 User login

 Protected routes/endpoints

### Advanced Requirements (VG)

 Role-based access (admin vs user)

 Advanced data handling: SQLite view user_bookings

 PWA functionality (service worker + manifest)

### 🗄️ Database

Tables:

users

bookings

menu_items

View: user_bookings that joins user to its bookings

### Authentication & Roles

Login required to create and view personal bookings

Protected routes: MyBookingsPage (user), AdminBookingsPage (admin only), MenuItemEditor edit/delete/create menu (admin only)

Roles:

Admin: can view, edit, and delete all bookings and menu items

User: can only view and delete their own bookings

### 📱 PWA

Service worker registered

manifest.json included

### 📌 Known Limitations

More validation in backend to ensure a hacker cant access another users bookings.

Im getting 500 error when no user is logged in. Should be 401 error

---

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
