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
  FiList,
  FiInfo,
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
  // First time user (could be stored in localStorage in a real app)
  const [showExplanation, setShowExplanation] = useState(true);
  // Confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState(null);

  // Toggle routine expansion
  const toggleRoutineExpansion = (routineId) => {
    setExpandedRoutines((prev) => ({
      ...prev,
      [routineId]: !prev[routineId],
    }));
  };

  // Handle routine deletion confirmation
  const handleDeleteClick = (e, routineId) => {
    e.stopPropagation();
    setRoutineToDelete(routineId);
    setShowDeleteModal(true);
  };

  // Confirm and execute routine deletion
  const confirmDelete = async () => {
    if (routineToDelete) {
      await deleteRoutine(routineToDelete);
      setShowDeleteModal(false);
      setRoutineToDelete(null);
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

      {/* Explanation Card for New Users */}
      {showExplanation && (
        <Card className="bg-blue-50 border-blue-200">
          <Card.Body>
            <div className="flex items-start justify-between">
              <div className="flex space-x-4">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <FiInfo className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Understanding Routines & Tasks
                  </h3>
                  <div className="space-y-2 text-blue-700">
                    <p>
                      <strong>Routines:</strong> Think of routines as containers
                      or categories for your tasks. Examples:
                    </p>
                    <ul className="list-disc list-inside ml-4 mb-2">
                      <li>Morning Workout Routine</li>
                      <li>Study Plan</li>
                      <li>Evening Wind-down</li>
                    </ul>
                    <p>
                      <strong>Tasks:</strong> These are the specific activities
                      within each routine that you complete regularly. Examples:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      <li>Do 30 pushups (part of Morning Workout Routine)</li>
                      <li>Read textbook for 30 minutes (part of Study Plan)</li>
                      <li>
                        Meditate for 10 minutes (part of Evening Wind-down)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowExplanation(false)}
                className="text-blue-500 hover:text-blue-700"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
          </Card.Body>
        </Card>
      )}

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
            Create your first routine to organize and track your regular
            activities.
          </p>
          <div className="mt-6">
            <Link to="/routines/new">
              <Button leftIcon={<FiPlus />}>Create a Routine</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {routines.map((routine) => (
            <Card
              key={routine.id}
              className={`${
                routine.is_active ? "" : "opacity-75"
              } hover:shadow-md transition-shadow duration-200`}
            >
              <div
                className="flex items-center justify-between cursor-pointer px-4 py-4"
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
                    <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 rounded text-xs">
                      {routine.tasks.length} tasks
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {routine.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 h-3 w-3" />
                      <span>
                        Created: {formatDate(routine.created_at, "MMM d, yyyy")}
                      </span>
                    </div>
                    {routine.start_date && (
                      <div className="flex items-center">
                        <FiClock className="mr-1 h-3 w-3" />
                        <span>
                          Started:{" "}
                          {formatDate(routine.start_date, "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/routines/${routine.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-primary-600 hover:text-primary-700"
                  >
                    <span className="sr-only">View Details</span>
                    <FiList className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`/routines/${routine.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Edit</span>
                    <FiEdit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={(e) => handleDeleteClick(e, routine.id)}
                    disabled={isDeletingRoutine}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <span className="sr-only">Delete</span>
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
                <div className="mt-2 border-t pt-4 px-4 pb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">
                      Tasks in this Routine
                    </h4>
                    <Link
                      to={`/routines/${routine.id}/tasks/new`}
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <FiPlus className="mr-1 h-4 w-4" />
                      Add Task
                    </Link>
                  </div>

                  {routine.tasks.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500 italic">
                        No tasks in this routine yet.
                      </p>
                      <Link
                        to={`/routines/${routine.id}/tasks/new`}
                        className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700"
                      >
                        Add your first task
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {routine.tasks.slice(0, 3).map((task) => (
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
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="mt-1 flex flex-wrap items-center gap-2">
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
                          </div>
                        </div>
                      ))}

                      {routine.tasks.length > 3 && (
                        <div className="text-center mt-2">
                          <Link
                            to={`/routines/${routine.id}`}
                            className="text-primary-600 font-medium hover:text-primary-700 text-sm"
                          >
                            View all {routine.tasks.length} tasks
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex space-x-2 justify-end">
                    <Link
                      to={`/routines/${routine.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/routines/${routine.id}/tasks/new`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Add Task
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this routine? All tasks in this
              routine will also be deleted. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setRoutineToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={isDeletingRoutine}
              >
                Delete Routine
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutinesList;
