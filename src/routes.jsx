import React from "react";
import { Navigate, useRoutes } from "react-router-dom";

import Layout from "@components/layout/Layout";

// Pages
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import Dashboard from "@pages/dashboard/Dashboard";
import RoutinesList from "@pages/routines/RoutinesList";
import RoutineForm from "@pages/routines/RoutineForm";
import TaskForm from "@pages/tasks/TaskForm";
import Progress from "@pages/progress/Progress";
import Leaderboard from "@pages/leaderboard/Leaderboard";
import Settings from "@pages/settings/Settings";

// Auth guard for protected routes
import AuthGuard from "@components/common/AuthGuard";
import GuestGuard from "@components/common/GuestGuard";

const Routes = () => {
  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: "register",
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: "/",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "routines", element: <RoutinesList /> },
        { path: "routines/new", element: <RoutineForm /> },
        { path: "routines/:routineId/edit", element: <RoutineForm /> },
        { path: "routines/:routineId/tasks/new", element: <TaskForm /> },
        {
          path: "routines/:routineId/tasks/:taskId/edit",
          element: <TaskForm />,
        },
        { path: "progress", element: <Progress /> },
        { path: "leaderboard", element: <Leaderboard /> },
        { path: "settings", element: <Settings /> },
      ],
    },
    { path: "login", element: <Navigate to="/auth/login" /> },
    { path: "register", element: <Navigate to="/auth/register" /> },
    { path: "*", element: <Navigate to="/dashboard" /> },
  ]);
};

export default Routes;
