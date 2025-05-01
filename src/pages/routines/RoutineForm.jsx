import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiSave, FiX, FiInfo } from "react-icons/fi";
import useRoutines from "@hooks/useRoutines";
import { formatForApi } from "@utils/dateUtils";

import Card from "@components/common/Card";
import Input, { TextArea } from "@components/common/Input";
import Button from "@components/common/Button";

const RoutineForm = () => {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!routineId;

  const {
    getRoutine,
    createRoutine,
    updateRoutine,
    isCreatingRoutine,
    isUpdatingRoutine,
  } = useRoutines();

  // Fetch routine data if editing
  const { data: routineData, isLoading: isLoadingRoutine } =
    getRoutine(routineId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      is_active: true,
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
    },
  });

  // Set form values when routine data is loaded
  useEffect(() => {
    if (isEditing && routineData) {
      reset({
        title: routineData.title,
        description: routineData.description || "",
        is_active: routineData.is_active,
        start_date: routineData.start_date
          ? new Date(routineData.start_date).toISOString().split("T")[0]
          : "",
        end_date: routineData.end_date
          ? new Date(routineData.end_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [isEditing, routineData, reset]);

  const onSubmit = async (data) => {
    // Format dates for API
    const formattedData = {
      ...data,
      start_date: data.start_date
        ? new Date(data.start_date).toISOString()
        : null,
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
    };

    if (isEditing) {
      await updateRoutine({ routineId, data: formattedData });
      navigate(`/routines/${routineId}`);
    } else {
      const newRoutine = await createRoutine(formattedData);
      navigate(`/routines/${newRoutine.id}/tasks/new`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Explanation Card for New Users */}
      {!isEditing && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <Card.Body>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-4 flex-shrink-0">
                <FiInfo className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Creating a Routine
                </h3>
                <div className="space-y-2 text-blue-700">
                  <p>
                    A <strong>routine</strong> is a collection of related tasks
                    that you perform regularly.
                  </p>
                  <p className="text-sm">Examples of routines:</p>
                  <ul className="list-disc list-inside ml-4 text-sm">
                    <li>Morning Workout</li>
                    <li>Evening Study Plan</li>
                    <li>Weekend Chores</li>
                  </ul>
                  <p className="text-sm italic mt-2">
                    After creating your routine, you'll be able to add specific
                    tasks to it.
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <Card.Title>
            {isEditing ? "Edit Routine" : "Create New Routine"}
          </Card.Title>
        </Card.Header>

        <Card.Body>
          {isEditing && isLoadingRoutine ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading routine data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                id="title"
                label="Routine Title"
                placeholder="Name your collection of tasks (e.g., 'Morning Workout')"
                error={errors.title?.message}
                {...register("title", {
                  required: "Title is required",
                })}
              />

              <TextArea
                id="description"
                label="Description (optional)"
                placeholder="What's the purpose of this routine? When do you typically do these tasks?"
                rows={4}
                error={errors.description?.message}
                {...register("description")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="start_date"
                  label="Start Date"
                  type="date"
                  error={errors.start_date?.message}
                  {...register("start_date")}
                />

                <Input
                  id="end_date"
                  label="End Date (optional)"
                  type="date"
                  error={errors.end_date?.message}
                  {...register("end_date")}
                />
              </div>

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
                  onClick={() => navigate("/routines")}
                  leftIcon={<FiX />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isCreatingRoutine || isUpdatingRoutine}
                  leftIcon={<FiSave />}
                >
                  {isEditing ? "Update" : "Create"} Routine
                </Button>
              </div>
            </form>
          )}
        </Card.Body>
      </Card>

      {!isEditing && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">What happens next?</h4>
          <p className="text-gray-600 mb-2">
            After creating your routine, you'll be able to add specific tasks to
            it. Tasks are the individual activities you want to track within
            this routine.
          </p>
          <p className="text-gray-600 text-sm italic">
            For example, if your routine is "Morning Workout", your tasks might
            include "30 pushups", "5-minute plank", and "2-mile run".
          </p>
        </div>
      )}
    </div>
  );
};

export default RoutineForm;
