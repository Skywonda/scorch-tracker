import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiUser, FiPhone, FiUserPlus } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import useAuth from "@hooks/useAuth";

import Input, { Select } from "@components/common/Input";
import Button from "@components/common/Button";

const roastIntensityOptions = [
  { value: "mild", label: "Mild - Gentle nudging" },
  { value: "medium", label: "Medium - Firm reminders" },
  { value: "spicy", label: "Spicy - No holding back" },
  { value: "extreme", label: "Extreme - Brutally honest" },
];

const Register = () => {
  const { register: registerUser, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      whatsapp_opt_in: true,
      roast_intensity: "medium",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    // Remove confirmPassword as it's not needed in the API
    const { confirmPassword, ...userData } = data;
    await registerUser(userData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
            <FaFire className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the accountability challenge today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              label="Email address"
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
              id="username"
              label="Username"
              type="text"
              leftIcon={<FiUser className="h-5 w-5 text-gray-400" />}
              error={errors.username?.message}
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              leftIcon={<FiLock className="h-5 w-5 text-gray-400" />}
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <Input
              id="confirmPassword"
              label="Confirm password"
              type="password"
              leftIcon={<FiLock className="h-5 w-5 text-gray-400" />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "The passwords do not match",
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
                  Receive WhatsApp notifications
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

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              leftIcon={<FiUserPlus className="h-5 w-5" />}
            >
              Create account
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
