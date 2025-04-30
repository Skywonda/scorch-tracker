import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import routinesApi from '@api/routines';
import toast from 'react-hot-toast';

const useRoutines = () => {
  const queryClient = useQueryClient();

  const {
    data: routines = [],
    isLoading: isLoadingRoutines,
    error: routinesError,
    refetch: refetchRoutines
  } = useQuery({
    queryKey: ['routines'],
    queryFn: routinesApi.getRoutines,
  });

  const getRoutine = (routineId) => {
    return useQuery({
      queryKey: ['routines', routineId],
      queryFn: () => routinesApi.getRoutine(routineId),
      enabled: !!routineId, // Only run if routineId is provided
    });
  };

  const createRoutineMutation = useMutation({
    mutationFn: routinesApi.createRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries(['routines']);
      toast.success('Routine created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create routine');
    },
  });

  const updateRoutineMutation = useMutation({
    mutationFn: ({ routineId, data }) => routinesApi.updateRoutine(routineId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['routines']);
      queryClient.invalidateQueries(['routines', data.id]);
      toast.success('Routine updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update routine');
    },
  });

  const deleteRoutineMutation = useMutation({
    mutationFn: routinesApi.deleteRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries(['routines']);
      toast.success('Routine deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete routine');
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ routineId, data }) => routinesApi.createTask(routineId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['routines']);
      queryClient.invalidateQueries(['routines', variables.routineId]);
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create task');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ routineId, taskId, data }) =>
      routinesApi.updateTask(routineId, taskId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['routines']);
      queryClient.invalidateQueries(['routines', variables.routineId]);
      toast.success('Task updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update task');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({ routineId, taskId }) => routinesApi.deleteTask(routineId, taskId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['routines']);
      queryClient.invalidateQueries(['routines', variables.routineId]);
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete task');
    },
  });

  return {
    routines,
    isLoadingRoutines,
    routinesError,
    refetchRoutines,
    getRoutine,

    createRoutine: createRoutineMutation.mutate,
    isCreatingRoutine: createRoutineMutation.isPending,

    updateRoutine: updateRoutineMutation.mutate,
    isUpdatingRoutine: updateRoutineMutation.isPending,

    deleteRoutine: deleteRoutineMutation.mutate,
    isDeletingRoutine: deleteRoutineMutation.isPending,

    createTask: createTaskMutation.mutate,
    isCreatingTask: createTaskMutation.isPending,

    updateTask: updateTaskMutation.mutate,
    isUpdatingTask: updateTaskMutation.isPending,

    deleteTask: deleteTaskMutation.mutate,
    isDeletingTask: deleteTaskMutation.isPending,
  };
};

export default useRoutines;