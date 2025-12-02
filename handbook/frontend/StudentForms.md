# pages/StudentForms.jsx — Component Documentation

---

## Imports

import SDFormCard from '../components/StudentRequests/SDFormCard';

- Imports the SDFormCard component.
- Used to display a card representing a student request form.
- Additional form cards can be added later inside the grid.

---

## Console Log

console.log("Rendering StudentForms component");

- Logs a message to the browser console.
- Useful for debugging and confirming when the component renders.

---

## Component Layout

The return() block contains the full UI structure.

---

### Top-Level Container

<div className="text-center">

- Wraps the entire page.
- Centers all text content horizontally.

---

### Page Title

<h1 className="mb-4 text-4xl font-bold text-gray-800">Student Forms</h1>

- Displays the main page heading.
- Uses large, bold typography for clarity and emphasis.

---

### Page Description

<p className="mb-8 text-lg text-gray-600">Access various forms for student requests and submissions.</p>

- Provides a short explanation of the page’s purpose.
- Styled with lighter text to differentiate it from the heading.

---

## Forms Grid

<div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">

- Creates a responsive grid layout.
- Layout behavior:
  - 1 column on small screens
  - 2 columns on medium screens
  - 3 columns on large screens
- Holds all student form cards, including SDFormCard.

---

## SDFormCard Component

<SDFormCard />

- Renders a single student request form card.
- Represents one form in the student requests section.
- More SDFormCard components can be added in the future.
- A comment notes where additional form cards can be inserted.

---

## Component Export

export default StudentForms;

- Exports the StudentForms component for use in routing or pages.
