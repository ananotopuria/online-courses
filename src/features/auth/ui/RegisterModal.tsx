import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  registerSchema,
  type ApiErrorResponse,
  type RegisterFormValues,
} from "../schemas/auth.schema";
import { useRegister } from "../hooks/useAuth";

type RegisterModalProps = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};

function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const registerMutation = useRegister();
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormValues>,
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      avatar: null,
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setValue("avatar", file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setPreview(objectUrl);
  };

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    try {
      await registerMutation.mutateAsync(values);
      onClose();
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const responseErrors = error.response?.data?.errors;

        if (responseErrors) {
          Object.entries(responseErrors).forEach(([field, messages]) => {
            setError(field as keyof RegisterFormValues, {
              message: messages[0],
            });
          });
        } else {
          setError("root", {
            type: "server",
            message:
              error.response?.data?.message || "რეგისტრაცია ვერ შესრულდა",
          });
        }
      }
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sign Up</h2>
          <button type="button" onClick={onClose}>
            X
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              placeholder="Username"
              {...register("username")}
              className="w-full rounded-lg border p-3 outline-none"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full rounded-lg border p-3 outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full rounded-lg border p-3 outline-none"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("password_confirmation")}
              className="w-full rounded-lg border p-3 outline-none"
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleAvatarChange}
            />
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-500">
                {errors.avatar.message}
              </p>
            )}
          </div>

          {preview && (
            <img
              src={preview}
              alt="Avatar preview"
              className="h-20 w-20 rounded-full object-cover"
            />
          )}

          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-lg bg-black py-3 text-white"
          >
            {registerMutation.isPending ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>,
    document.body,
  );
}

export default RegisterModal;
