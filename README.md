# Kanban Board

A Kanban board web application built with React, TypeScript, and modern drag-and-drop functionality using `@dnd-kit`. The application allows users to organize tasks into columns, perform task and column management, and sort and search tasks seamlessly. Additional features include light/dark theme toggling and local storage persistance.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Features](#features)
- [Technology Choices and Rationale](#technology-choices-and-rationale)
- [Known Limitations and Trade-offs](#known-limitations-and-trade-offs)
- [Future Improvements](#future-improvements)

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (>= 14.x)
- npm (>= 6.x) or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Agrimzz/kanban_board.git
   cd kanban_board
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   or

   ```bash
   yarn start
   ```

4. Open the application in your browser at `http://localhost:5173`.

---

## Features

### Core Features

1. **Column Management:**

   - Add, rename, and delete columns.
   - Drag and reorder columns.

2. **Task Management:**

   - Add, edit, and delete tasks within columns.
   - Drag and drop tasks between columns or reorder tasks within a column.

3. **Search and Sorting:**

   - Search tasks by content.
   - Sort columns alphabetically (A-Z, Z-A) or by the number of tasks (High to Low, Low to High).

4. **Theme Toggling:**

   - Switch between light and dark themes with state persistence via `localStorage`.

5. **Local Storage Persistence:**
   - All columns, tasks, and preferences persist across page reloads.

---

## Technology Choices and Rationale

1. **React:**

   - Chosen for its component-based architecture and ease of state management with hooks.

2. **TypeScript:**

   - Provides type safety, making the codebase more robust and easier to maintain.

3. **@dnd-kit:**

   - A modern drag-and-drop library offering flexibility and performance for reordering columns and tasks.

4. **Tailwind CSS:**

   - Simplifies styling with utility-first CSS classes, reducing the need for custom CSS files.

5. **localStorage:**
   - Enables client-side persistence for columns, tasks, and user preferences without requiring a backend.

---

## Known Limitations and Trade-offs

1. **No Backend Integration:**

   - The application uses `localStorage` for persistence, making it unsuitable for multi-user scenarios.

2. **Scalability:**

   - As the number of tasks and columns increases, performance might degrade due to the client-side rendering and local storage limitations.

3. **Limited Sorting Options:**

   - Sorting is limited to column titles and task counts; advanced sorting/filtering options could be added.

4. **Undo/Redo Functionality:**
   - Lacks undo/redo functionality.

---

## Future Improvements

1. **Backend Integration:**

   - Implement a backend using Node.js or Firebase to enable multi-user collaboration and centralized data storage.

2. **Advanced Filtering and Sorting:**

   - Add support for filtering tasks based on status, priority, or tags.

3. **Authentication:**

   - Add user authentication to allow personalized boards for multiple users.

4. **Real-time Updates:**

   - Use WebSocket or libraries like `socket.io` for real-time updates in collaborative sessions.

5. **Offline Support:**

   - Implement Service Workers to enable offline access and syncing.

6. **Improved Accessibility:**

   - Ensure the application is fully accessible by adhering to WCAG guidelines.

7. **Performance Optimization:**

   - Optimize drag-and-drop performance for large datasets.

8. **Enhanced Task Details:**

   - Allow adding descriptions, due dates, and attachments to tasks.

9. **Undo/Redo Funcitonality:**
   - Add undo/redo functionality to allow users to undo/redo their actions.

---

Feel free to explore the repository and contribute by opening issues or submitting pull requests! Happy coding!
