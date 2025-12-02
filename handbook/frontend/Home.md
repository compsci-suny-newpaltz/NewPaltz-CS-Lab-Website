# pages/Home.jsx — Component Documentation

---

## Imports

import Hero from '../components/HomePage/HeroSection';

- Imports the **Hero** component.
- Displays the main banner section of the homepage.
- Used for introductory text, visuals, or a general overview of the site.

import BentoBox from '../components/HomePage/BentoBox';

- Imports the **BentoBox** component.
- Displays a grid-style layout showcasing key site features or sections.
- Highlights important content blocks on the homepage.

---

## Home Component Overview

The **Home** component represents the main landing page of the website.

It is responsible for:

- Displaying the **Hero** section.
- Displaying the **BentoBox** section.
- Structuring the homepage layout and content flow.

---

## Rendered Elements

### Hero Section

<Hero />

- Renders the top banner section of the homepage.
- Often used for welcoming users, showing important announcements, or presenting primary site information.

### BentoBox Section

<BentoBox />

- Renders the homepage’s featured content grid.
- Highlights various areas, features, or functionality of the site.

---

## Component Export

export default Home;

- Exports the Home component so it can be used in the site’s routing system as the homepage.
