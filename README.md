# ScorchTrack Frontend

A modern React frontend for the ScorchTrack accountability system with personalized roasting.

## Features

- **User Authentication**: Secure login and registration
- **Dashboard**: Track progress and view statistics
- **Routines Management**: Create and manage your daily routines
- **Tasks Tracking**: Track your tasks and mark them as complete
- **Progress Visualization**: See your progress over time with beautiful charts
- **Leaderboard**: Compete with other users
- **Personalized Settings**: Configure your roast intensity level

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for server state, React Context for app state
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors for auth
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Charts**: Recharts

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/your-username/scorchtrack-frontend.git
cd scorchtrack-frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

## Project Structure

The project follows a clean, maintainable structure:

- `src/api/`: API integration layer
- `src/components/`: Reusable UI components
- `src/contexts/`: React contexts (auth, theme)
- `src/hooks/`: Custom React hooks
- `src/pages/`: Application pages
- `src/utils/`: Utility functions
- `src/styles/`: Global styles

## Authentication

The app uses JWT tokens for authentication. Tokens are stored in local storage and automatically attached to API requests through Axios interceptors.

## Data Fetching

Server state is managed with React Query, providing:

- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

## Customization

### Theme

The app uses Tailwind CSS with a custom color palette. The primary colors can be adjusted in the `tailwind.config.js` file.

### Components

All UI components are built as reusable elements with Tailwind CSS. They support different variants, sizes, and states.

## API Integration

The frontend communicates with the ScorchTrack API through services defined in the `api` directory. Each service corresponds to a specific resource:

- `auth.js`: Authentication endpoints
- `routines.js`: Routines and tasks
- `progress.js`: Task completions and progress
- `users.js`: User profiles and settings

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is proprietary and confidential.
