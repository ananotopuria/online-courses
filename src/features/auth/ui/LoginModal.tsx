import axios from "axios";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  loginSchema,
  type ApiErrorResponse,
  type LoginFormValues,
} from "../schemas/auth.schema";
import { useLogin } from "../hooks/useAuth";

type LoginModalProps = {
  onClose: () => void;
  onSwitchToRegister: () => void;
};

function LoginModal({ onClose, onSwitchToRegister }: LoginModalProps) {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 🔒 scroll lock (pro UX)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values);
      onClose();
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError("root", {
          message: error.response?.data?.message || "ავტორიზაცია ვერ შესრულდა",
        });
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
          <h2 className="text-xl font-semibold">Log In</h2>
          <button type="button" onClick={onClose}>
            X
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-black py-3 text-white"
          >
            {loginMutation.isPending ? "Loading..." : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>,
    document.body,
  );
}

export default LoginModal;
