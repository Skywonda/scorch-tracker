import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiSave, FiX } from "react-icons/fi";
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
    } else {
      await createRoutine(formattedData);
    }

    navigate("/routines");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <Card.Header>
          <Card.Title>
            {isEditing ? "Edit Routine" : "Create Routine"}
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
                error={errors.title?.message}
                {...register("title", {
                  required: "Title is required",
                })}
              />

              <TextArea
                id="description"
                label="Description (optional)"
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
    </div>
  );
};

export default RoutineForm;
