import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import useRoutines from "@hooks/useRoutines";
import { formatDate } from "@utils/dateUtils";

import Card from "@components/common/Card";
import Button from "@components/common/Button";

const RoutinesList = () => {
  const { routines, isLoadingRoutines, deleteRoutine, isDeletingRoutine } =
    useRoutines();

  // Track expanded routines
  const [expandedRoutines, setExpandedRoutines] = useState({});

  // Toggle routine expansion
  const toggleRoutineExpansion = (routineId) => {
    setExpandedRoutines((prev) => ({
      ...prev,
      [routineId]: !prev[routineId],
    }));
  };

  // Handle routine deletion
  const handleDeleteRoutine = (routineId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this routine? This action cannot be undone."
      )
    ) {
      deleteRoutine(routineId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Routines</h1>
        <Link to="/routines/new">
          <Button leftIcon={<FiPlus />}>New Routine</Button>
        </Link>
      </div>

      {isLoadingRoutines ? (
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-24 bg-gray-200 rounded mx-auto"></div>
            <div className="h-24 bg-gray-200 rounded mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading routines...</p>
        </div>
      ) : routines.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <FiCalendar className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No routines yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first routine to start tracking your tasks.
          </p>
          <div className="mt-6">
            <Link to="/routines/new">
              <Button leftIcon={<FiPlus />}>Create a routine</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {routines.map((routine) => (
            <Card
              key={routine.id}
              className={`${routine.is_active ? "" : "opacity-75"}`}
            >
              <div
                className="flex items-center justify-between cursor-pointer px-2"
                onClick={() => toggleRoutineExpansion(routine.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {routine.title}
                    </h3>
                    {!routine.is_active && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{routine.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 h-3 w-3" />
                      <span>
                        Created: {formatDate(routine.created_at, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1 h-3 w-3" />
                      <span>Tasks: {routine.tasks.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/routines/${routine.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <FiEdit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoutine(routine.id);
                    }}
                    disabled={isDeletingRoutine}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                  {expandedRoutines[routine.id] ? (
                    <FiChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Tasks list */}
              {expandedRoutines[routine.id] && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-700">Tasks</h4>
                    <Link
                      to={`/routines/${routine.id}/tasks/new`}
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      Add Task
                    </Link>
                  </div>

                  {routine.tasks.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No tasks in this routine yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {routine.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-md ${
                            task.is_active
                              ? "bg-gray-50"
                              : "bg-gray-50 opacity-60"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-800">
                                {task.title}
                              </h5>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="mt-1 flex items-center space-x-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {task.points} points
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {task.frequency}
                                </span>
                                {!task.is_active && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link
                                to={`/routines/${routine.id}/tasks/${task.id}/edit`}
                                className="p-1 text-gray-400 hover:text-gray-500"
                              >
                                <FiEdit className="h-4 w-4" />
                              </Link>
                              <button
                                className="p-1 text-gray-400 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle task deletion (would need to be implemented)
                                }}
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutinesList;
