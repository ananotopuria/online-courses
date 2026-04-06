import axios from "axios";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, X } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-115 rounded-[18px] bg-white px-8 pb-8 pt-7 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-[#9E9E9E] transition hover:text-black"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-[28px] font-bold leading-none text-[#1D1D1F]">
            Welcome Back
          </h2>
          <p className="mt-3 text-[15px] text-[#6F6F73]">
            Log in to continue your learning
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#353535]">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="h-12.5 w-full rounded-[10px] border border-[#D6D6DB] px-4 text-[15px] outline-none transition focus:border-[#5B50FF]"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#353535]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="h-12.5 w-full rounded-[10px] border border-[#D6D6DB] px-4 pr-12 text-[15px] outline-none transition focus:border-[#5B50FF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A6]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">
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
            className="mt-1 h-12 w-full rounded-[10px] bg-[#4F46E5] text-[17px] font-medium text-white transition hover:bg-[#4338CA] disabled:opacity-70"
          >
            {loginMutation.isPending ? "Loading..." : "Log In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E4E4E7]" />
          <span className="text-[14px] text-[#8D8D93]">or</span>
          <div className="h-px flex-1 bg-[#E4E4E7]" />
        </div>

        <p className="text-center text-[14px] text-[#707076]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-[#1D1D1F] underline underline-offset-2"
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
