# Task

A React Native task management app built with Expo and Firebase. Organize your tasks efficiently with priority levels, categories, due dates, and real-time synchronization.

## Features

- **User Authentication**: Secure sign up and login with Firebase Authentication
- **Task Management**: Create, edit, delete, and complete tasks
- **Task Organization**: Tasks are automatically organized by time (Today, Tomorrow, This Week, Completed)
- **Priority Levels**: Set task priority (High, Medium, Low) with color-coded indicators
- **Categories**: Organize tasks by category (Work, Personal, Study, Health, Shopping, Family)
- **Due Dates**: Set and track due dates for tasks
- **Search Functionality**: Search tasks by title, description, or tags
- **Progress Tracking**: Visual progress bar showing completed vs total tasks
- **Responsive Design**: Optimized for different screen sizes

## Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- Firebase project configured

## Installation

```bash
npm install
```

## Running the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Firebase Implementation

The app uses Firebase for both authentication and data storage:

- **Firebase Authentication**: Handles user sign up, login, and session management. User authentication state is persisted using AsyncStorage for seamless app experience.

- **Firebase Firestore**: All tasks are stored in a Firestore collection called `tasks`. Each task document contains:
  - `title`: Task title (required)
  - `description`: Task description
  - `dueDate`: Due date in ISO string format
  - `priority`: Priority level (high, medium, low)
  - `category`: Task category
  - `completed`: Boolean indicating completion status
  - `createdAt`: Timestamp when task was created
  - `updatedAt`: Timestamp when task was last updated

Tasks are automatically synced with Firebase, ensuring data persistence across devices and sessions.

## Task Creation

To create a new task:
1. Tap the floating action button (FAB) at the bottom of the screen
2. Fill in the task details:
   - **Title** (required): The main task name
   - **Description**: Additional details about the task
   - **Due Date**: Select a date using the date picker
   - **Priority**: Choose High, Medium, or Low
   - **Category**: Select from available categories
3. Tap "Save" to create the task

The task is immediately saved to Firebase Firestore and appears in the appropriate time-based section (Today, Tomorrow, or This Week) based on its due date.

## Task Completion

Tasks can be marked as completed by:
1. Tapping the checkbox on any task item
2. The task automatically moves to the "Completed" section
3. The completion status and `updatedAt` timestamp are synced to Firebase

You can toggle tasks back to incomplete by tapping the checkbox again, and they will return to their original time-based section.

## Tech Stack

- React Native
- Expo
- Firebase (Authentication & Firestore)
- React Navigation
- AsyncStorage

