import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiSave, FiX } from "react-icons/fi";
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

  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState([]);

  const { getRoutine, createTask, updateTask, isCreatingTask, isUpdatingTask } =
    useRoutines();

  // Fetch routine and task data
  const { data: routineData, isLoading: isLoadingRoutine } =
    getRoutine(routineId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
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

  // Watch frequency field
  const frequency = watch("frequency");

  // Update local state when frequency changes
  useEffect(() => {
    setSelectedFrequency(frequency);
  }, [frequency]);

  // Set form values when task data is loaded
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

        // Set weekdays for weekly tasks
        if (task.frequency === "weekly" && task.frequency_config.days) {
          setSelectedWeekdays(
            task.frequency_config.days.map((day) => day.toString())
          );
        }

        // Set month days for monthly tasks
        if (task.frequency === "monthly" && task.frequency_config.days) {
          setSelectedMonthDays(
            task.frequency_config.days.map((day) => day.toString())
          );
        }
      }
    }
  }, [isEditing, routineData, taskId, reset]);

  // Handle weekday selection
  const handleWeekdayChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedWeekdays((prev) => [...prev, value]);
    } else {
      setSelectedWeekdays((prev) => prev.filter((day) => day !== value));
    }
  };

  // Handle month day selection
  const handleMonthDayChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedMonthDays((prev) => [...prev, value]);
    } else {
      setSelectedMonthDays((prev) => prev.filter((day) => day !== value));
    }
  };

  const onSubmit = async (data) => {
    // Build frequency config based on frequency type
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
      // Custom frequency logic would go here
      frequency_config = data.frequency_config;
    }

    const taskData = {
      ...data,
      frequency_config,
    };

    if (isEditing) {
      await updateTask({ routineId, taskId, data: taskData });
    } else {
      await createTask({ routineId, data: taskData });
    }

    navigate(`/routines`);
  };

  if (isLoadingRoutine) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <Card.Header>
          <Card.Title>
            {isEditing ? "Edit Task" : "Create Task"} for {routineData?.title}
          </Card.Title>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="title"
              label="Task Title"
              error={errors.title?.message}
              {...register("title", {
                required: "Title is required",
              })}
            />

            <TextArea
              id="description"
              label="Description (optional)"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/routines`)}
                leftIcon={<FiX />}
              >
                Cancel
              </Button>
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
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskForm;
