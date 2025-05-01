import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiPlus, FiTrash2, FiX, FiSave, FiEdit } from "react-icons/fi";
import useRoutines from "@hooks/useRoutines";

import Card from "@components/common/Card";
import Input, { TextArea, Select } from "@components/common/Input";
import Button from "@components/common/Button";

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

const weekdayOptions = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const TaskForm = () => {
  const { routineId, taskId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!taskId;

  const [batchMode, setBatchMode] = useState(!isEditing);
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState([]);

  const { getRoutine, createTask, updateTask, isCreatingTask, isUpdatingTask } =
    useRoutines();

  const { data: routineData, isLoading: isLoadingRoutine } =
    getRoutine(routineId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      points: 1,
      is_active: true,
      frequency: "daily",
      frequency_config: {},
    },
  });

  const frequency = watch("frequency");

  useEffect(() => {
    setSelectedFrequency(frequency);
  }, [frequency]);

  useEffect(() => {
    if (isEditing && routineData) {
      const task = routineData.tasks.find((t) => t.id === parseInt(taskId));
      if (task) {
        reset({
          title: task.title,
          description: task.description || "",
          points: task.points,
          is_active: task.is_active,
          frequency: task.frequency,
          frequency_config: task.frequency_config,
        });

        if (task.frequency === "weekly" && task.frequency_config.days) {
          setSelectedWeekdays(
            task.frequency_config.days.map((day) => day.toString())
          );
        }

        if (task.frequency === "monthly" && task.frequency_config.days) {
          setSelectedMonthDays(
            task.frequency_config.days.map((day) => day.toString())
          );
        }
      }
    }
  }, [isEditing, routineData, taskId, reset]);

  const handleWeekdayChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedWeekdays((prev) => [...prev, value]);
    } else {
      setSelectedWeekdays((prev) => prev.filter((day) => day !== value));
    }
  };

  const handleMonthDayChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedMonthDays((prev) => [...prev, value]);
    } else {
      setSelectedMonthDays((prev) => prev.filter((day) => day !== value));
    }
  };

  const addTask = (data) => {
    let frequency_config = {};

    if (data.frequency === "weekly") {
      frequency_config = {
        days: selectedWeekdays.map((day) => parseInt(day)),
      };
    } else if (data.frequency === "monthly") {
      frequency_config = {
        days: selectedMonthDays.map((day) => parseInt(day)),
      };
    } else if (data.frequency === "custom") {
      frequency_config = data.frequency_config;
    }

    const taskData = {
      ...data,
      frequency_config,
    };

    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = taskData;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, taskData]);
    }

    reset({
      title: "",
      description: "",
      points: 1,
      is_active: true,
      frequency: "daily",
      frequency_config: {},
    });
    setSelectedWeekdays([]);
    setSelectedMonthDays([]);
    setSelectedFrequency("daily");
  };

  const editTask = (index) => {
    const task = tasks[index];
    reset({
      title: task.title,
      description: task.description || "",
      points: task.points,
      is_active: task.is_active,
      frequency: task.frequency,
      frequency_config: task.frequency_config,
    });

    setSelectedFrequency(task.frequency);

    if (task.frequency === "weekly" && task.frequency_config.days) {
      setSelectedWeekdays(
        task.frequency_config.days.map((day) => day.toString())
      );
    } else {
      setSelectedWeekdays([]);
    }

    if (task.frequency === "monthly" && task.frequency_config.days) {
      setSelectedMonthDays(
        task.frequency_config.days.map((day) => day.toString())
      );
    } else {
      setSelectedMonthDays([]);
    }

    setEditingIndex(index);
  };

  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    if (editingIndex === index) {
      reset({
        title: "",
        description: "",
        points: 1,
        is_active: true,
        frequency: "daily",
        frequency_config: {},
      });
      setSelectedWeekdays([]);
      setSelectedMonthDays([]);
      setSelectedFrequency("daily");
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const saveAllTasks = async () => {
    if (tasks.length === 0) return;

    setIsSaving(true);

    try {
      for (const taskData of tasks) {
        await createTask({ routineId, data: taskData });
      }

      navigate(`/routines/${routineId}`);
    } catch (error) {
      console.error("Error saving tasks:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data) => {
    let frequency_config = {};

    if (data.frequency === "weekly") {
      frequency_config = {
        days: selectedWeekdays.map((day) => parseInt(day)),
      };
    } else if (data.frequency === "monthly") {
      frequency_config = {
        days: selectedMonthDays.map((day) => parseInt(day)),
      };
    } else if (data.frequency === "custom") {
      frequency_config = data.frequency_config;
    }

    const taskData = {
      ...data,
      frequency_config,
    };

    if (isEditing) {
      await updateTask({ routineId, taskId, data: taskData });
      navigate(`/routines/${routineId}`);
    } else if (batchMode) {
      addTask(data);
    } else {
      await createTask({ routineId, data: taskData });
      navigate(`/routines/${routineId}`);
    }
  };

  if (isLoadingRoutine) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!isEditing && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <Card.Body>
            <div className="space-y-2 text-blue-700">
              <p>
                <strong>Routine:</strong> A collection of related tasks (like
                "Morning Workout" or "Study Plan").
              </p>
              <p>
                <strong>Tasks:</strong> Specific activities within a routine
                that you complete regularly (like "30 Pushups" or "Read for 30
                minutes").
              </p>
              <p className="italic text-sm">
                You're now adding tasks to your "{routineData?.title}" routine.
              </p>
            </div>
          </Card.Body>
        </Card>
      )}

      {!isEditing && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-batch-mode"
                checked={batchMode}
                onChange={() => setBatchMode(!batchMode)}
                className="checked:bg-primary-600 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggle-batch-mode"
                className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
            <label
              htmlFor="toggle-batch-mode"
              className="text-sm font-medium text-gray-700"
            >
              Batch Creation Mode {batchMode ? "(ON)" : "(OFF)"}
            </label>
          </div>
          <div className="text-sm text-gray-600">
            Tasks in queue: <span className="font-bold">{tasks.length}</span>
          </div>
        </div>
      )}

      <Card>
        <Card.Header>
          <Card.Title>
            {isEditing
              ? "Edit Task"
              : editingIndex !== null
              ? `Edit Task #${editingIndex + 1}`
              : `Add ${batchMode ? "Multiple Tasks" : "a New Task"} for ${
                  routineData?.title
                }`}
          </Card.Title>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="title"
              label="Task Title"
              placeholder="What specific action will you perform? (e.g., 'Do 20 pushups')"
              error={errors.title?.message}
              {...register("title", {
                required: "Title is required",
              })}
            />

            <TextArea
              id="description"
              label="Description (optional)"
              placeholder="Add any additional details about how to complete this task"
              rows={3}
              error={errors.description?.message}
              {...register("description")}
            />

            <Input
              id="points"
              label="Points"
              type="number"
              min="1"
              error={errors.points?.message}
              {...register("points", {
                required: "Points are required",
                min: {
                  value: 1,
                  message: "Points must be at least 1",
                },
              })}
            />

            <Select
              id="frequency"
              label="Frequency"
              options={frequencyOptions}
              error={errors.frequency?.message}
              {...register("frequency", {
                required: "Frequency is required",
              })}
            />

            {/* Frequency-specific options */}
            {selectedFrequency === "weekly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of the Week
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekdayOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`weekday-${option.value}`}
                        type="checkbox"
                        value={option.value}
                        checked={selectedWeekdays.includes(option.value)}
                        onChange={handleWeekdayChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`weekday-${option.value}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedWeekdays.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    Please select at least one day
                  </p>
                )}
              </div>
            )}

            {selectedFrequency === "monthly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of the Month
                </label>
                <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        id={`monthday-${day}`}
                        type="checkbox"
                        value={day.toString()}
                        checked={selectedMonthDays.includes(day.toString())}
                        onChange={handleMonthDayChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`monthday-${day}`}
                        className="ml-1 block text-sm text-gray-700"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedMonthDays.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    Please select at least one day
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center">
              <input
                id="is_active"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register("is_active")}
              />
              <label
                htmlFor="is_active"
                className="ml-2 block text-sm text-gray-700"
              >
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              {editingIndex !== null && batchMode ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingIndex(null);
                    reset({
                      title: "",
                      description: "",
                      points: 1,
                      is_active: true,
                      frequency: "daily",
                    });
                    setSelectedWeekdays([]);
                    setSelectedMonthDays([]);
                    setSelectedFrequency("daily");
                  }}
                >
                  Cancel Edit
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/routines/${routineId}`)}
                >
                  Cancel
                </Button>
              )}

              {batchMode && !isEditing ? (
                <Button
                  type="button"
                  onClick={handleSubmit(addTask)}
                  variant="secondary"
                  disabled={
                    (selectedFrequency === "weekly" &&
                      selectedWeekdays.length === 0) ||
                    (selectedFrequency === "monthly" &&
                      selectedMonthDays.length === 0)
                  }
                  leftIcon={<FiPlus />}
                >
                  {editingIndex !== null ? "Update Task" : "Add Task"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={isCreatingTask || isUpdatingTask}
                  disabled={
                    (selectedFrequency === "weekly" &&
                      selectedWeekdays.length === 0) ||
                    (selectedFrequency === "monthly" &&
                      selectedMonthDays.length === 0)
                  }
                  leftIcon={<FiSave />}
                >
                  {isEditing ? "Update" : "Create"} Task
                </Button>
              )}
            </div>
          </form>
        </Card.Body>
      </Card>

      {batchMode && !isEditing && tasks.length > 0 && (
        <div className="mt-6">
          <Card>
            <Card.Header>
              <Card.Title>Tasks ({tasks.length})</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border ${
                      index === editingIndex
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 bg-gray-50"
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
                          {task.frequency === "weekly" &&
                            task.frequency_config?.days?.length > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                {task.frequency_config.days.length} days/week
                              </span>
                            )}
                          {task.frequency === "monthly" &&
                            task.frequency_config?.days?.length > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                {task.frequency_config.days.length} days/month
                              </span>
                            )}
                          {!task.is_active && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => editTask(index)}
                          className="p-1 text-gray-400 hover:text-primary-500"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button
                  onClick={saveAllTasks}
                  fullWidth
                  isLoading={isSaving}
                  leftIcon={<FiSave />}
                >
                  Save All Tasks ({tasks.length})
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
