import React from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiCheck,
  FiClock,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import useRoutines from "@hooks/useRoutines";
import useProgress from "@hooks/useProgress";
import { formatDate } from "@utils/dateUtils";

import Card from "@components/common/Card";
import Button from "@components/common/Button";

const Dashboard = () => {
  const { routines, isLoadingRoutines } = useRoutines();
  const { completions, stats, todayCompletions } = useProgress();

  // Prepare data for the weekly completion chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: formatDate(date, "EEE"),
      fullDate: date.toISOString().split("T")[0],
      completed: 0,
      total: 0,
    };
  });

  // Fill in completion data
  completions.forEach((completion) => {
    const completionDate = new Date(completion.completed_at)
      .toISOString()
      .split("T")[0];
    const dayData = last7Days.find((day) => day.fullDate === completionDate);
    if (dayData) {
      dayData.completed += 1;
    }
  });

  // Fill in total task data - this is simplified, in a real app we'd calculate based on task frequency
  routines.forEach((routine) => {
    routine.tasks.forEach((task) => {
      last7Days.forEach((day) => {
        // For simplicity, assuming all tasks are daily
        day.total += 1;
      });
    });
  });

  // Calculate completion rate
  last7Days.forEach((day) => {
    day.rate =
      day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/routines/new">
          <Button leftIcon={<FiPlus />}>New Routine</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">
                Tasks Completed Today
              </p>
              <p className="text-green-900 text-2xl font-bold mt-1">
                {todayCompletions.length}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <FiCheck className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">
                Current Streak
              </p>
              <p className="text-blue-900 text-2xl font-bold mt-1">
                {stats?.current_streak || 0} days
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">
                Total Points
              </p>
              <p className="text-purple-900 text-2xl font-bold mt-1">
                {stats?.points || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <FiAward className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-700 text-sm font-medium">
                Completion Rate
              </p>
              <p className="text-orange-900 text-2xl font-bold mt-1">
                {stats?.completion_rate || 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <FaFire className="h-6 w-6 text-orange-700" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Weekly Activity</Card.Title>
          </Card.Header>
          <Card.Body className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={last7Days}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" name="Completed" fill="#8b5cf6" />
                <Bar dataKey="total" name="Total Tasks" fill="#c4b5fd" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        {/* Today's Tasks */}
        <Card>
          <Card.Header>
            <Card.Title>Today's Tasks</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {isLoadingRoutines ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              ) : routines.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No routines created yet</p>
                  <Link
                    to="/routines/new"
                    className="text-primary-600 font-medium hover:text-primary-700 mt-2 inline-block"
                  >
                    Create your first routine
                  </Link>
                </div>
              ) : (
                <div>
                  {routines.slice(0, 3).map((routine) => (
                    <div key={routine.id} className="mb-4">
                      <h3 className="font-medium text-gray-900">
                        {routine.title}
                      </h3>
                      <div className="mt-2 space-y-2">
                        {routine.tasks.slice(0, 3).map((task) => {
                          const isCompleted = todayCompletions.some(
                            (completion) => completion.task_id === task.id
                          );

                          return (
                            <div
                              key={task.id}
                              className={`flex items-center justify-between p-2 rounded ${
                                isCompleted ? "bg-green-50" : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`h-4 w-4 rounded-full mr-2 ${
                                    isCompleted ? "bg-green-500" : "bg-gray-300"
                                  }`}
                                />
                                <span
                                  className={`${
                                    isCompleted
                                      ? "line-through text-gray-500"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>
                              <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                                {task.points} pts
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <Link
                    to="/routines"
                    className="text-primary-600 font-medium hover:text-primary-700 mt-4 inline-block"
                  >
                    View all routines
                  </Link>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <Card.Header>
          <Card.Title>Recent Achievements</Card.Title>
        </Card.Header>
        <Card.Body>
          {stats?.achievements?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.achievements.slice(0, 3).map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="p-3 bg-yellow-200 rounded-full mr-3">
                    <FiAward className="h-5 w-5 text-yellow-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-900">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {achievement.description}
                    </p>
                    <span className="text-xs font-medium bg-yellow-200 text-yellow-800 rounded px-2 py-0.5 mt-1 inline-block">
                      +{achievement.points} points
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FiAward className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No achievements yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start completing your daily tasks to earn achievements!
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
