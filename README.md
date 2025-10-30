# TASX

A minimalist task management app with a retro receipt-style interface.

## Features

- Create tasks with title and description
- Track task status (pending → in progress → done)
- Delete tasks
- Real-time status updates
- Receipt-themed UI with monospace font

## Tech Stack

- React + TypeScript
- Material-UI (MUI)
- TanStack Query (React Query)
- Custom API integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the App

```bash
# Start development server
npm run dev
```

The app will open in your browser at `http://localhost:5173` (or the port specified by your dev server).

## Usage

1. **Add a task**: Enter a title (required) and optional description, then click "ADD ITEM"
2. **Start a task**: Click the play icon to move a pending task to "in progress"
3. **Complete a task**: Click the check icon to mark an in-progress task as "done"
4. **Delete a task**: Click the trash icon to remove any task

## API

The app requires an API with the following endpoints:

- `GET /tasks` - List all tasks
- `POST /tasks` - Create a task
- `PATCH /tasks/:id` - Update task status
- `DELETE /tasks/:id` - Delete a task

Update the `api.ts` file with your API configuration.