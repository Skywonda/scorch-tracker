import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiChevronLeft,
  FiCheck,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import useRoutines from "@hooks/useRoutines";
import useProgress from "@hooks/useProgress";
import { formatDate } from "@utils/dateUtils";

import Card from "@components/common/Card";
import Button from "@components/common/Button";

const RoutineDetails = () => {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const {
    getRoutine,
    deleteRoutine,
    deleteTask,
    isDeletingRoutine,
    isDeletingTask,
  } = useRoutines();
  const { completeTask, isCompletingTask, todayCompletions } = useProgress();

  const { data: routine, isLoading } = getRoutine(routineId);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-24 bg-gray-200 rounded mx-auto"></div>
          <div className="h-24 bg-gray-200 rounded mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading routine details...</p>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Routine not found</p>
        <Link to="/routines" className="text-primary-600 mt-4 inline-block">
          Back to Routines
        </Link>
      </div>
    );
  }

  const handleDeleteRoutine = async () => {
    await deleteRoutine(routineId);
    navigate("/routines");
  };

  const handleDeleteTask = async (taskId) => {
    setTaskToDelete(taskId);
    setShowConfirmDelete(true);
  };

  const confirmDeleteTask = async () => {
    await deleteTask({ routineId, taskId: taskToDelete });
    setShowConfirmDelete(false);
    setTaskToDelete(null);
  };

  const handleCompleteTask = async (taskId) => {
    await completeTask({ taskId });
  };

  // Group tasks by frequency for better organization
  const groupedTasks = {
    daily: routine.tasks.filter((task) => task.frequency === "daily"),
    weekly: routine.tasks.filter((task) => task.frequency === "weekly"),
    monthly: routine.tasks.filter((task) => task.frequency === "monthly"),
    custom: routine.tasks.filter((task) => task.frequency === "custom"),
  };

  // Calculate some stats for the routine
  const totalTasks = routine.tasks.length;
  const activeTasks = routine.tasks.filter((task) => task.is_active).length;
  const totalPoints = routine.tasks.reduce((sum, task) => sum + task.points, 0);
  const completedToday = routine.tasks.filter((task) =>
    todayCompletions.some((completion) => completion.task_id === task.id)
  ).length;

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div>
        <Link
          to="/routines"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <FiChevronLeft className="mr-1" /> Back to Routines
        </Link>
      </div>

      {/* Routine header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            {routine.title}
            {!routine.is_active && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                Inactive
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">{routine.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <FiCalendar className="mr-1 h-4 w-4" />
              <span>
                Created: {formatDate(routine.created_at, "MMM d, yyyy")}
              </span>
            </div>
            {routine.start_date && (
              <div className="flex items-center">
                <FiClock className="mr-1 h-4 w-4" />
                <span>
                  Started: {formatDate(routine.start_date, "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to={`/routines/${routineId}/edit`}>
            <Button leftIcon={<FiEdit />} variant="outline">
              Edit Routine
            </Button>
          </Link>
          <Button
            leftIcon={<FiTrash2 />}
            variant="danger"
            onClick={handleDeleteRoutine}
            isLoading={isDeletingRoutine}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Routine stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="p-4">
            <p className="text-sm font-medium text-green-700">Total Tasks</p>
            <p className="text-2xl font-bold text-green-900">{totalTasks}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="p-4">
            <p className="text-sm font-medium text-blue-700">Active Tasks</p>
            <p className="text-2xl font-bold text-blue-900">{activeTasks}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="p-4">
            <p className="text-sm font-medium text-purple-700">Total Points</p>
            <p className="text-2xl font-bold text-purple-900">{totalPoints}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="p-4">
            <p className="text-sm font-medium text-orange-700">
              Completed Today
            </p>
            <p className="text-2xl font-bold text-orange-900">
              {completedToday} / {activeTasks}
            </p>
          </div>
        </Card>
      </div>

      {/* Explanation card for the difference between routines and tasks */}
      <Card className="bg-blue-50 border-blue-200">
        <Card.Body>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Understanding Routines & Tasks
          </h3>
          <div className="space-y-2 text-blue-700">
            <p>
              <strong>Routine:</strong> A collection of related tasks (like
              "Morning Workout" or "Study Plan").
            </p>
            <p>
              <strong>Tasks:</strong> Specific activities within a routine that
              you complete regularly (like "30 Pushups" or "Read for 30
              minutes").
            </p>
            <p className="italic text-sm">
              You're currently viewing your "{routine.title}" routine with{" "}
              {totalTasks} tasks.
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Tasks List with Add Task Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Tasks in this Routine
        </h2>
        <Link to={`/routines/${routineId}/tasks/new`}>
          <Button leftIcon={<FiPlus />}>Add Task</Button>
        </Link>
      </div>

      {totalTasks === 0 ? (
        <Card className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <FiClock className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No tasks in this routine yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by adding a task to this routine
          </p>
          <div className="mt-6">
            <Link to={`/routines/${routineId}/tasks/new`}>
              <Button leftIcon={<FiPlus />}>Add Your First Task</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Daily Tasks */}
          {groupedTasks.daily.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>
                  <div className="flex items-center">
                    <span className="mr-2">Daily Tasks</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {groupedTasks.daily.length}
                    </span>
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  {groupedTasks.daily.map((task) => {
                    const isCompleted = todayCompletions.some(
                      (completion) => completion.task_id === task.id
                    );

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-md ${
                          isCompleted
                            ? "bg-green-50 border border-green-100"
                            : task.is_active
                            ? "bg-gray-50 border border-gray-200"
                            : "bg-gray-50 border border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {isCompleted ? (
                              <div className="mt-0.5 bg-green-200 text-green-700 rounded-full p-1">
                                <FiCheck className="h-4 w-4" />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={isCompletingTask || !task.is_active}
                                className={`mt-0.5 rounded-full p-1 ${
                                  task.is_active
                                    ? "bg-gray-200 text-gray-500 hover:bg-primary-100 hover:text-primary-600"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <FiCheck className="h-4 w-4" />
                              </button>
                            )}
                            <div>
                              <h5
                                className={`font-medium ${
                                  isCompleted
                                    ? "text-gray-500 line-through"
                                    : "text-gray-800"
                                }`}
                              >
                                {task.title}
                              </h5>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="mt-1 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {task.points} points
                                </span>
                                {!task.is_active && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-1">
                            <Link
                              to={`/routines/${routineId}/tasks/${task.id}/edit`}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <FiEdit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Weekly Tasks */}
          {groupedTasks.weekly.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>
                  <div className="flex items-center">
                    <span className="mr-2">Weekly Tasks</span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {groupedTasks.weekly.length}
                    </span>
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  {groupedTasks.weekly.map((task) => {
                    const isCompleted = todayCompletions.some(
                      (completion) => completion.task_id === task.id
                    );

                    // Get day names for display
                    const dayNames = [];
                    if (task.frequency_config && task.frequency_config.days) {
                      const dayMap = [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                      ];
                      dayNames.push(
                        ...task.frequency_config.days.map((day) => dayMap[day])
                      );
                    }

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-md ${
                          isCompleted
                            ? "bg-green-50 border border-green-100"
                            : task.is_active
                            ? "bg-gray-50 border border-gray-200"
                            : "bg-gray-50 border border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {isCompleted ? (
                              <div className="mt-0.5 bg-green-200 text-green-700 rounded-full p-1">
                                <FiCheck className="h-4 w-4" />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={isCompletingTask || !task.is_active}
                                className={`mt-0.5 rounded-full p-1 ${
                                  task.is_active
                                    ? "bg-gray-200 text-gray-500 hover:bg-primary-100 hover:text-primary-600"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <FiCheck className="h-4 w-4" />
                              </button>
                            )}
                            <div>
                              <h5
                                className={`font-medium ${
                                  isCompleted
                                    ? "text-gray-500 line-through"
                                    : "text-gray-800"
                                }`}
                              >
                                {task.title}
                              </h5>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="mt-1 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {task.points} points
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  {dayNames.join(", ")}
                                </span>
                                {!task.is_active && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-1">
                            <Link
                              to={`/routines/${routineId}/tasks/${task.id}/edit`}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <FiEdit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Monthly Tasks */}
          {groupedTasks.monthly.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>
                  <div className="flex items-center">
                    <span className="mr-2">Monthly Tasks</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {groupedTasks.monthly.length}
                    </span>
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  {groupedTasks.monthly.map((task) => {
                    const isCompleted = todayCompletions.some(
                      (completion) => completion.task_id === task.id
                    );

                    // Format days for display
                    let daysStr = "";
                    if (task.frequency_config && task.frequency_config.days) {
                      const days = task.frequency_config.days;
                      if (days.length <= 5) {
                        daysStr = days.join(", ");
                      } else {
                        daysStr = `${days.length} days`;
                      }
                    }

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-md ${
                          isCompleted
                            ? "bg-green-50 border border-green-100"
                            : task.is_active
                            ? "bg-gray-50 border border-gray-200"
                            : "bg-gray-50 border border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {isCompleted ? (
                              <div className="mt-0.5 bg-green-200 text-green-700 rounded-full p-1">
                                <FiCheck className="h-4 w-4" />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={isCompletingTask || !task.is_active}
                                className={`mt-0.5 rounded-full p-1 ${
                                  task.is_active
                                    ? "bg-gray-200 text-gray-500 hover:bg-primary-100 hover:text-primary-600"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <FiCheck className="h-4 w-4" />
                              </button>
                            )}
                            <div>
                              <h5
                                className={`font-medium ${
                                  isCompleted
                                    ? "text-gray-500 line-through"
                                    : "text-gray-800"
                                }`}
                              >
                                {task.title}
                              </h5>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="mt-1 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {task.points} points
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {daysStr} of month
                                </span>
                                {!task.is_active && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-1">
                            <Link
                              to={`/routines/${routineId}/tasks/${task.id}/edit`}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <FiEdit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Custom Tasks */}
          {groupedTasks.custom.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>
                  <div className="flex items-center">
                    <span className="mr-2">Custom Schedule Tasks</span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {groupedTasks.custom.length}
                    </span>
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  {groupedTasks.custom.map((task) => {
                    const isCompleted = todayCompletions.some(
                      (completion) => completion.task_id === task.id
                    );

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-md ${
                          isCompleted
                            ? "bg-green-50 border border-green-100"
                            : task.is_active
                            ? "bg-gray-50 border border-gray-200"
                            : "bg-gray-50 border border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {isCompleted ? (
                              <div className="mt-0.5 bg-green-200 text-green-700 rounded-full p-1">
                                <FiCheck className="h-4 w-4" />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={isCompletingTask || !task.is_active}
                                className={`mt-0.5 rounded-full p-1 ${
                                  task.is_active
                                    ? "bg-gray-200 text-gray-500 hover:bg-primary-100 hover:text-primary-600"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <FiCheck className="h-4 w-4" />
                              </button>
                            )}
                            <div>
                              <h5
                                className={`font-medium ${
                                  isCompleted
                                    ? "text-gray-500 line-through"
                                    : "text-gray-800"
                                }`}
                              >
                                {task.title}
                              </h5>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="mt-1 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {task.points} points
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  Custom Schedule
                                </span>
                                {!task.is_active && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-1">
                            <Link
                              to={`/routines/${routineId}/tasks/${task.id}/edit`}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <FiEdit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmDelete(false);
                  setTaskToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteTask}
                isLoading={isDeletingTask}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineDetails;
