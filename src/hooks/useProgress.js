import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import progressApi from '@api/progress';
import toast from 'react-hot-toast';

const useProgress = () => {
  const queryClient = useQueryClient();

  const {
    data: completions = [],
    isLoading: isLoadingCompletions,
    error: completionsError,
    refetch: refetchCompletions
  } = useQuery({
    queryKey: ['completions'],
    queryFn: progressApi.getUserCompletions,
  });
  const getTaskCompletions = (taskId) => {
    return useQuery({
      queryKey: ['completions', 'task', taskId],
      queryFn: () => progressApi.getTaskCompletions(taskId),
      enabled: !!taskId, // Only run if taskId is provided
    });
  };

  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['stats'],
    queryFn: progressApi.getUserStats,
    onError: () => {
      return {
        points: 0,
        tasks_completed: 0,
        tasks_missed: 0,
        completion_rate: 0,
        current_streak: 0,
        achievements: []
      };
    }
  });

  const completeTaskMutation = useMutation({
    mutationFn: ({ taskId, data = {} }) => progressApi.completeTask(taskId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['completions']);
      queryClient.invalidateQueries(['completions', 'task', variables.taskId]);
      queryClient.invalidateQueries(['stats']);
      queryClient.invalidateQueries(['routines']);

      toast.success('Task completed! 🎉');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to complete task');
    },
  });

  const completionsByDate = completions.reduce((acc, completion) => {
    const date = new Date(completion.completed_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(completion);
    return acc;
  }, {});

  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = completionsByDate[today] || [];

  return {
    completions,
    isLoadingCompletions,
    completionsError,
    refetchCompletions,
    getTaskCompletions,

    stats,
    isLoadingStats,
    statsError,
    refetchStats,

    completionsByDate,
    todayCompletions,

    completeTask: completeTaskMutation.mutate,
    isCompletingTask: completeTaskMutation.isPending,
  };
};

export default useProgress;