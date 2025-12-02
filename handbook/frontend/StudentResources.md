**File:** `pages/StudentResources.jsx`

The Student Resources page displays academic, programming, and career-oriented resources available to students. It supports searching, filtering, pagination, and dynamic loading of resource cards retrieved from the backend.

---

## Overview

This page fetches all student resources from the backend, stores them in state, and renders them with search and filter functionality. Pagination ensures a clean and manageable layout.

---

## Imports

### React Hooks
    import { useState, useEffect } from "react";

Used for managing component state and running logic when the page loads.

### ResourceCard Component
    import ResourceCard from "../components/StudentResources/ResourceCard";

Renders each resource as an individual card.

### Resource Service
    import resourceService from "../services/resourceService";

Handles API calls and includes:
- getAllResources()
- addResource(resourceData)
- deleteResource(resourceID)
- editResource(resourceId, updatedData)
- getResourceByID(resourceId)

### SearchBar Component
    import SearchBar from "../components/StudentResources/SearchBar";

Provides the search input for filtering resources.

---

## State Variables

### Resource List
    const [resources, setResources] = useState([]);

Stores all resources fetched from the backend.

### Loading State
    const [isLoading, setIsLoading] = useState(true);

Tracks loading status and displays “Loading resources…” while fetching data.

### Error Handling
    const [error, setError] = useState(null);

Stores and displays any error messages.

### Search Query
    const [searchQuery, setSearchQuery] = useState("");

Stores the user’s search input for filtering.

### Category Selection
    const [selectedCategory, setSelectedCategory] = useState("all");

Tracks the selected category from the dropdown.

### Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 6;

- `currentPage`: tracks which pagination page is active  
- `cardsPerPage`: determines how many cards display per page  

---

## useEffect — Loading Resources on Mount

    useEffect(() => {
      // loads resources on mount
    }, []);

This effect:
1. Sets the loading state  
2. Calls resourceService.getAllResources()  
3. Saves the retrieved resources  
4. Handles errors  
5. Turns off the loading indicator  

---

## Categories List

Used to populate the category dropdown:

    ['all', 'programming', 'web development', 'cybersecurity', 'artificial intelligence', 'Technical Interviews']

---

## Summary

The Student Resources page provides:
- Dynamic loading of student resources  
- Search and category filtering  
- Clean, card-based UI  
- Pagination  
- Robust loading and error handling  
