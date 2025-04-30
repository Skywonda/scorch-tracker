import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiAward, FiTrendingUp, FiClock } from "react-icons/fi";
import usersApi from "@api/users";
import useAuth from "@hooks/useAuth";

import Card from "@components/common/Card";
import Button from "@components/common/Button";

// Mock data for development - in real app, this would come from the API
const mockLeaderboardData = [
  {
    user_id: 1,
    username: "accountability_master",
    points: 450,
    achievements_count: 5,
    streak: 7,
    completion_rate: 92,
  },
  {
    user_id: 2,
    username: "fitness_guru",
    points: 380,
    achievements_count: 4,
    streak: 5,
    completion_rate: 85,
  },
  {
    user_id: 3,
    username: "early_riser",
    points: 350,
    achievements_count: 3,
    streak: 12,
    completion_rate: 78,
  },
  {
    user_id: 4,
    username: "productivity_king",
    points: 320,
    achievements_count: 4,
    streak: 4,
    completion_rate: 75,
  },
  {
    user_id: 5,
    username: "health_enthusiast",
    points: 280,
    achievements_count: 2,
    streak: 3,
    completion_rate: 65,
  },
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("points"); // 'points', 'streak', or 'rate'

  // Fetch leaderboard data
  const {
    data: leaderboardData = mockLeaderboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: usersApi.getLeaderboard,
    // If API endpoint doesn't exist yet, use mock data
    onError: () => mockLeaderboardData,
  });

  // Sort data based on active tab
  const getSortedData = () => {
    switch (activeTab) {
      case "points":
        return [...leaderboardData].sort((a, b) => b.points - a.points);
      case "streak":
        return [...leaderboardData].sort((a, b) => b.streak - a.streak);
      case "rate":
        return [...leaderboardData].sort(
          (a, b) => b.completion_rate - a.completion_rate
        );
      default:
        return leaderboardData;
    }
  };

  const sortedData = getSortedData();

  // Find current user's ranking
  const getUserRanking = () => {
    const userIndex = sortedData.findIndex((item) => item.user_id === user?.id);
    return userIndex !== -1 ? userIndex + 1 : null;
  };

  const userRanking = getUserRanking();

  // Get medal for top 3
  const getMedal = (index) => {
    switch (index) {
      case 0:
        return <span className="text-yellow-500 text-xl">🥇</span>;
      case 1:
        return <span className="text-gray-400 text-xl">🥈</span>;
      case 2:
        return <span className="text-amber-600 text-xl">🥉</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>

        <div className="flex space-x-2">
          <Button
            variant={activeTab === "points" ? "primary" : "outline"}
            onClick={() => setActiveTab("points")}
            leftIcon={<FiAward />}
          >
            Points
          </Button>
          <Button
            variant={activeTab === "streak" ? "primary" : "outline"}
            onClick={() => setActiveTab("streak")}
            leftIcon={<FiTrendingUp />}
          >
            Streak
          </Button>
          <Button
            variant={activeTab === "rate" ? "primary" : "outline"}
            onClick={() => setActiveTab("rate")}
            leftIcon={<FiClock />}
          >
            Completion Rate
          </Button>
        </div>
      </div>

      {/* User's rank card */}
      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold">
              {userRanking ? `#${userRanking}` : "?"}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Your Ranking
              </h3>
              <p className="text-sm text-gray-600">Keep up the good work!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-gray-500">Points</p>
                <p className="text-lg font-bold text-primary-700">
                  {user?.points || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Streak</p>
                <p className="text-lg font-bold text-primary-700">
                  {leaderboardData.find((item) => item.user_id === user?.id)
                    ?.streak || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion</p>
                <p className="text-lg font-bold text-primary-700">
                  {leaderboardData.find((item) => item.user_id === user?.id)
                    ?.completion_rate || 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Leaderboard table */}
      <Card>
        <Card.Header>
          <Card.Title>
            {activeTab === "points" && "Top Points Leaders"}
            {activeTab === "streak" && "Top Streaks"}
            {activeTab === "rate" && "Highest Completion Rates"}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500">Failed to load leaderboard data</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rank
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {activeTab === "points" && "Points"}
                      {activeTab === "streak" && "Current Streak"}
                      {activeTab === "rate" && "Completion Rate"}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Achievements
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((userData, index) => (
                    <tr
                      key={userData.user_id}
                      className={
                        userData.user_id === user?.id ? "bg-primary-50" : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {getMedal(index)}
                          <span className="ml-1">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                            {userData.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {userData.username}
                            </div>
                            {userData.user_id === user?.id && (
                              <div className="text-xs text-primary-600">
                                You
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {activeTab === "points" && `${userData.points} pts`}
                          {activeTab === "streak" && `${userData.streak} days`}
                          {activeTab === "rate" &&
                            `${userData.completion_rate}%`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {Array.from({
                            length: Math.min(userData.achievements_count, 5),
                          }).map((_, i) => (
                            <div
                              key={i}
                              className="h-6 w-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center -ml-1 first:ml-0"
                            >
                              <FiAward className="h-3 w-3" />
                            </div>
                          ))}
                          {userData.achievements_count > 5 && (
                            <div className="ml-1 text-xs text-gray-500 flex items-center">
                              +{userData.achievements_count - 5} more
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Leaderboard;
