import React, { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiCheckSquare,
  FiBarChart2,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useProgress from "@hooks/useProgress";
import useRoutines from "@hooks/useRoutines";
import { formatDate, formatRelative, checkIsToday } from "@utils/dateUtils";

import Card from "@components/common/Card";
import Button from "@components/common/Button";

// Helper function to get dates for current month grid
const getDaysInMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      date,
      dayOfMonth: i + 1,
      isToday: checkIsToday(date),
      dateString: date.toISOString().split("T")[0],
    };
  });
};

const Progress = () => {
  const { completions, completionsByDate, completeTask, isCompletingTask } =
    useProgress();
  const { routines, isLoadingRoutines } = useRoutines();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'list'

  // Get days for calendar grid
  const daysInMonth = getDaysInMonth();

  // Tasks for today (based on selected date)
  const getDayTasks = () => {
    const dayTasks = [];

    // Find all tasks that should be active on the selected date
    routines.forEach((routine) => {
      if (!routine.is_active) return;

      routine.tasks.forEach((task) => {
        if (!task.is_active) return;

        // Check if task should be active on selected date
        // This is simplified logic - in a real app, you'd check against frequency_config
        let isTaskActiveOnDate = false;

        if (task.frequency === "daily") {
          isTaskActiveOnDate = true;
        } else if (task.frequency === "weekly") {
          const dayOfWeek = new Date(selectedDate).getDay();
          isTaskActiveOnDate =
            task.frequency_config?.days?.includes(dayOfWeek) || false;
        } else if (task.frequency === "monthly") {
          const dayOfMonth = new Date(selectedDate).getDate();
          isTaskActiveOnDate =
            task.frequency_config?.days?.includes(dayOfMonth) || false;
        }

        if (isTaskActiveOnDate) {
          // Check if task is already completed for the selected date
          const isCompleted =
            completionsByDate[selectedDate]?.some(
              (completion) => completion.task_id === task.id
            ) || false;

          dayTasks.push({
            ...task,
            routineTitle: routine.title,
            isCompleted,
          });
        }
      });
    });

    return dayTasks;
  };

  const dayTasks = getDayTasks();

  // Prepare data for the streak chart
  const getStreakData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: formatDate(date, "MMM d"),
        fullDate: date.toISOString().split("T")[0],
        count: 0,
      };
    });

    // Count completions for each day
    Object.keys(completionsByDate).forEach((dateStr) => {
      const dayData = last30Days.find((day) => day.fullDate === dateStr);
      if (dayData) {
        dayData.count = completionsByDate[dateStr].length;
      }
    });

    return last30Days;
  };

  const streakData = getStreakData();

  // Handle completion toggle
  const handleToggleTaskCompletion = async (task) => {
    if (!task.isCompleted) {
      await completeTask({ taskId: task.id });
    }
    // Note: Our API doesn't support "uncompleting" tasks, so we only handle completion
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "calendar" ? "primary" : "outline"}
            onClick={() => setViewMode("calendar")}
            leftIcon={<FiCalendar />}
          >
            Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            onClick={() => setViewMode("list")}
            leftIcon={<FiBarChart2 />}
          >
            Stats
          </Button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <>
          {/* Calendar View */}
          <Card>
            <Card.Header>
              <Card.Title>{formatDate(new Date(), "MMMM yyyy")}</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 p-1"
                    >
                      {day}
                    </div>
                  )
                )}

                {/* Empty spaces for days that don't belong to this month */}
                {Array.from({
                  length: new Date(daysInMonth[0].date).getDay(),
                }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-1"></div>
                ))}

                {/* Days of the month */}
                {daysInMonth.map(
                  ({ date, dayOfMonth, isToday, dateString }) => {
                    const hasCompletions = !!completionsByDate[dateString];
                    const completionCount =
                      completionsByDate[dateString]?.length || 0;

                    return (
                      <div
                        key={dateString}
                        className={`
                        p-1 text-center rounded-md cursor-pointer
                        ${
                          selectedDate === dateString
                            ? "bg-primary-100 border border-primary-300"
                            : ""
                        }
                        ${isToday ? "font-bold" : ""}
                        hover:bg-gray-100
                      `}
                        onClick={() => setSelectedDate(dateString)}
                      >
                        <div className="text-sm">{dayOfMonth}</div>
                        {hasCompletions && (
                          <div className="mt-1 text-xs">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {completionCount}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Tasks for selected date */}
          <Card>
            <Card.Header>
              <Card.Title>Tasks for {formatDate(selectedDate)}</Card.Title>
            </Card.Header>
            <Card.Body>
              {isLoadingRoutines ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              ) : dayTasks.length === 0 ? (
                <div className="text-center py-6">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <FiClock className="h-12 w-12" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No tasks for this day
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no scheduled tasks for the selected date.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`
                        flex items-center justify-between p-3 rounded-md
                        ${task.isCompleted ? "bg-green-50" : "bg-gray-50"}
                      `}
                    >
                      <div className="flex items-center">
                        <div
                          className={`
                            flex-shrink-0 h-6 w-6 rounded-full mr-3
                            ${
                              task.isCompleted
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-200"
                            }
                            flex items-center justify-center
                          `}
                        >
                          {task.isCompleted && (
                            <FiCheckSquare className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h4
                            className={`font-medium ${
                              task.isCompleted
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {task.routineTitle} • {task.points} points
                          </p>
                        </div>
                      </div>

                      {!task.isCompleted && checkIsToday(selectedDate) && (
                        <Button
                          size="sm"
                          onClick={() => handleToggleTaskCompletion(task)}
                          isLoading={isCompletingTask}
                        >
                          Complete
                        </Button>
                      )}

                      {task.isCompleted && (
                        <span className="text-xs text-green-600 font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      ) : (
        <>
          {/* Stats View */}
          <Card>
            <Card.Header>
              <Card.Title>30-Day Activity</Card.Title>
            </Card.Header>
            <Card.Body className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={streakData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Completed Tasks"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>

          {/* Recent Completions */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Completions</Card.Title>
            </Card.Header>
            <Card.Body>
              {completions.length === 0 ? (
                <div className="text-center py-6">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <FiCheckSquare className="h-12 w-12" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No completions yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start completing tasks to see your progress here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completions.slice(0, 10).map((completion) => {
                    // Find corresponding task and routine
                    let taskInfo = {
                      title: "Unknown Task",
                      points: 0,
                      routineTitle: "Unknown Routine",
                    };

                    routines.forEach((routine) => {
                      const task = routine.tasks.find(
                        (t) => t.id === completion.task_id
                      );
                      if (task) {
                        taskInfo = {
                          title: task.title,
                          points: task.points,
                          routineTitle: routine.title,
                        };
                      }
                    });

                    return (
                      <div
                        key={completion.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {taskInfo.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {taskInfo.routineTitle} • {taskInfo.points} points
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(completion.completed_at, "MMM d")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatRelative(completion.completed_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Progress;
