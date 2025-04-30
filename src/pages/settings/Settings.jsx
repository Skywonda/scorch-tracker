import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FiSave, FiPhone, FiMail } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import usersApi from "@api/users";
import useAuth from "@hooks/useAuth";
import toast from "react-hot-toast";

import Card from "@components/common/Card";
import Input, { Select } from "@components/common/Input";
import Button from "@components/common/Button";

const roastIntensityOptions = [
  { value: "mild", label: "Mild - Gentle nudging" },
  { value: "medium", label: "Medium - Firm reminders" },
  { value: "spicy", label: "Spicy - No holding back" },
  { value: "extreme", label: "Extreme - Brutally honest" },
];

const Settings = () => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      phone_number: "",
      whatsapp_opt_in: true,
      roast_intensity: "medium",
    },
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        phone_number: user.phone_number || "",
        whatsapp_opt_in:
          user.whatsapp_opt_in === undefined ? true : user.whatsapp_opt_in,
        roast_intensity: user.roast_intensity || "medium",
      });
    }
  }, [user, reset]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    },
  });

  const onSubmit = async (data) => {
    await updateProfileMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <Card.Header>
          <Card.Title>Profile Settings</Card.Title>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="email"
              label="Email Address"
              type="email"
              leftIcon={<FiMail className="h-5 w-5 text-gray-400" />}
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <Input
              id="phone_number"
              label="WhatsApp Phone Number"
              type="tel"
              leftIcon={<FiPhone className="h-5 w-5 text-gray-400" />}
              error={errors.phone_number?.message}
              {...register("phone_number", {
                pattern: {
                  value: /^\+?[0-9]{10,15}$/,
                  message: "Invalid phone number format",
                },
              })}
            />

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="whatsapp_opt_in"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register("whatsapp_opt_in")}
                />
                <label
                  htmlFor="whatsapp_opt_in"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Receive WhatsApp notifications and reminders
                </label>
              </div>

              <Select
                id="roast_intensity"
                label="Roast Intensity"
                options={roastIntensityOptions}
                error={errors.roast_intensity?.message}
                {...register("roast_intensity", {
                  required: "Please select a roast intensity",
                })}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={updateProfileMutation.isPending}
                leftIcon={<FiSave />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {/* Roast Intensity Explanation */}
      <Card>
        <Card.Header>
          <Card.Title>About Roast Intensity</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <p className="text-gray-600">
              ScorchTrack uses friendly "roasts" to keep you motivated. Choose
              an intensity level that works for you:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <div className="flex items-center mb-2">
                  <FaFire className="h-4 w-4 text-green-500 mr-2" />
                  <h3 className="font-medium text-green-700">Mild</h3>
                </div>
                <p className="text-sm text-green-600">
                  "Looks like you missed your workout today. No worries,
                  tomorrow is another day to get back on track!"
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center mb-2">
                  <FaFire className="h-4 w-4 text-blue-500 mr-2" />
                  <h3 className="font-medium text-blue-700">Medium</h3>
                </div>
                <p className="text-sm text-blue-600">
                  "Three days without meditation? Your brain is probably as
                  cluttered as that desk you've been meaning to clean!"
                </p>
              </div>

              <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <div className="flex items-center mb-2">
                  <FaFire className="h-4 w-4 text-yellow-600 mr-2" />
                  <h3 className="font-medium text-yellow-700">Spicy</h3>
                </div>
                <p className="text-sm text-yellow-600">
                  "Missing your workout AGAIN? Those running shoes are
                  collecting more dust than your goals are collecting progress!"
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded-md border border-red-200">
                <div className="flex items-center mb-2">
                  <FaFire className="h-4 w-4 text-red-500 mr-2" />
                  <h3 className="font-medium text-red-700">Extreme</h3>
                </div>
                <p className="text-sm text-red-600">
                  "Your morning routine is more abandoned than that gym
                  membership you swore you'd use. Maybe rename 'daily'
                  meditation to 'whenever I feel like it'?"
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 italic">
              Note: All roasts are meant to be motivational and fun. If you'd
              prefer not to receive roasts, select the "Mild" option.
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Account Stats */}
      <Card>
        <Card.Header>
          <Card.Title>Account Statistics</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <div className="text-2xl font-bold text-gray-900">
                {user?.points || 0}
              </div>
              <div className="text-sm text-gray-500">Total Points</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-md">
              <div className="text-2xl font-bold text-gray-900">
                {new Date(user?.created_at || Date.now()).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">Join Date</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-md">
              <div className="text-2xl font-bold text-gray-900">
                {/* This would be calculated on backend */}0
              </div>
              <div className="text-sm text-gray-500">Achievements</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-md">
              <div className="text-2xl font-bold text-gray-900">
                {/* This would be calculated on backend */}0
              </div>
              <div className="text-sm text-gray-500">Completed Tasks</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
