# Events Module Documentation  

- **EventsPage.jsx**
- **EventEditPage.jsx**
- **EventAddPage.jsx**

Each section explains the imports, state variables, logic, and rendering behavior for the Events module in the Hydra CS Lab Website.

---

# EventsPage.jsx — Component Documentation

## Imports

import React, { useState, useEffect } from 'react';

- Imports React functional component utilities and lifecycle hooks.

import ThisWeekCarousel from '../../components/Events/ThisWeekCarousel';

- Displays events occurring during the current week in a carousel format.

import UpcomingEvents from '../../components/Events/UpcomingEvents';

- Shows future events (occurring after this week).

import PastEvents from '../../components/Events/PastEvents';

- Lists events that occurred before the current week.

import eventService from '../../services/eventService';

- Provides API functions such as getAllEvents().

---

## Component Overview

export default function EventsPage() { ... }

The EventsPage component:

- Fetches all events from the backend.
- Categorizes them into:
  - **This week’s events**
  - **Upcoming events**
  - **Past events**
- Renders three separate child components.
- Displays an event details popup when an event is clicked.

---

## State Variables

const [events, setEvents] = useState([]);

- Stores all events returned by the backend API.

const [selectedEvent, setSelectedEvent] = useState(null);

- Stores the event selected by the user (used for detail alerts).

---

## Fetching Events

useEffect(() => { ... }, []);

- Fetches events on component mount.
- Calls eventService.getAllEvents().
- Ensures eventsData is always an array before setting state.
- On error:
  - Logs the error
  - Sets events to an empty array

---

## Date Logic and Event Categorization

const now = new Date();

- Current date and time.

startOfWeek / endOfWeek:

- Calculates the Sunday–Saturday range of the current week.

### This Week’s Events

const thisWeekEvents = events.filter((e) => {
  const start = new Date(e.start_time);
  return start >= startOfWeek && start <= endOfWeek;
});

### Upcoming Events

const upcomingEvents = events.filter((e) => new Date(e.start_time) > endOfWeek);

### Past Events

const pastEvents = events.filter((e) => new Date(e.end_time) < startOfWeek);

---

## Event Click Handler

handleEventClick(event)

- Sets selectedEvent to the event clicked.
- Displays a popup alert showing:
  - Title  
  - Description  
  - Location  
  - Start time  
  - End time  

---

## Rendered Page Structure

The component returns a layout with padding and vertical spacing:

<div className="p-6 space-y-8">

- <ThisWeekCarousel events={thisWeekEvents} onEventClick={handleEventClick} />
- <UpcomingEvents events={upcomingEvents} onEventClick={handleEventClick} />
- <PastEvents events={pastEvents} onEventClick={handleEventClick} />

---

# EventEditPage.jsx — Component Documentation

## Imports

import React, { useState, useEffect, useContext } from "react";

- React and hooks for managing component state and lifecycle.

import { useParams } from "react-router-dom";

- Retrieves the event ID from the URL.

import eventService from "../../services/eventService";

- Provides event API functions (getEventById, editEvent, etc.)

import { AuthContext } from "../../context/authContext";

- Gives access to the current logged-in user.

---

## Component Overview

export default function EventEditPage() { ... }

This component:

- Loads an existing event.
- Allows authorized users to edit that event.
- Prevents club users from modifying events they do not own.

---

## State Variables

const { id } = useParams();

- Event ID from the URL.

const { user } = useContext(AuthContext);

- Logged-in user information.

const [formData, setFormData] = useState({...});

- Stores event fields for editing.

---

## Fetching the Event (with Authorization Rules)

useEffect(() => { ... }, [id, user]);

Inside fetchEvent():

- Requests event data via eventService.getEventById(id).
- If user.role === "club":
  - They may **only edit their own events**.
  - If data.admin_id !== user.id → user is blocked and redirected.
- Loads the event data into formData.

Errors show an alert.

---

## Handling Input Changes

handleChange(e)

- Updates formData fields.
- Supports file uploads and normal text inputs.

---

## Submitting the Edit Form

handleSubmit(e)

- Prevents default behavior.
- Creates a FormData object.
- Appends editable fields:
  - title, description, start_time, end_time, location, flyer_url
- Calls eventService.editEvent(id, data).
- On success:
  - Shows alert
  - Redirects to admin events panel
- On failure:
  - Logs and alerts error.

---

## Rendered Structure

The JSX includes:

- Title: **Edit Event**
- Description: explaining how to edit the event
- Form with labeled fields for:
  - Title
  - Description
  - Start time
  - End time
  - Location
  - Flyer upload
- A “Save Changes” button

---

# EventAddPage.jsx — Component Documentation

## Imports

import React, { useState, useContext } from "react";

- React and necessary hooks.

import eventService from "../../services/eventService";

- API for creating events.

import { AuthContext } from "../../context/authContext";

- Used to tag the event with the logged-in admin_id.

---

## Component Overview

export default function EventAddPage() { ... }

This component:

- Presents a form for creating new events.
- Assigns the event to the logged-in user via admin_id.
- Uploads flyers and text fields to the backend.

---

## State Variables

const { user } = useContext(AuthContext);

- Used to attach admin_id when submitting.

const [formData, setFormData] = useState({...});

- Holds all input fields.

---

## Handling Input Changes

handleChange(e)

- Similar to EventEditPage.
- Supports file and text inputs.

---

## Submitting the Create Event Form

handleSubmit(e)

- Prevents default behavior.
- Creates FormData.
- Appends event fields:
  - title, description, start_time, end_time, location, flyer_url
- Appends admin_id = user.id
- Calls eventService.createEvent(data)
- On success:
  - Shows success alert
  - Redirects to event admin panel
- On failure:
  - Shows error alert

---

## Rendered Structure

Page includes:

- Title: **Create Event**
- Short instruction paragraph
- Form fields for:
  - Title
  - Description
  - Start time
  - End time
  - Location
  - Flyer upload
- “Create Event” submission button

---

# Summary of All Three Files

| File | Purpose |
|------|---------|
| **EventsPage.jsx** | Displays all events categorized into this week, upcoming, and past. |
| **EventEditPage.jsx** | Loads an event and allows authorized users to edit it. |
| **EventAddPage.jsx** | Allows authenticated users to create new events. |

All three work together to create the **Events Management System** for Hydra CS Lab Website.

If you'd like these combined into a **printable PDF**, **project wiki format**, or **GitHub README styling**, I can generate that too.
