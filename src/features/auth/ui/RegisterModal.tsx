import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronLeft, Eye, EyeOff, Upload, X } from "lucide-react";

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

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormValues>,
    mode: "onSubmit",
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

  async function handleNextStep() {
    if (step === 1) {
      const isValid = await trigger("email");
      if (isValid) {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      const isValid = await trigger(["password", "password_confirmation"]);
      if (isValid) {
        setStep(3);
      }
    }
  }

  function handlePreviousStep() {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  }

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

  function renderProgress() {
    return (
      <div className="my-6 flex justify-between items-center gap-2">
        <div
          className={`h-2 flex-1 rounded-full ${
            step >= 1 ? "bg-[#b7b3f4]" : "bg-[#eeedfc]"
          }`}
        />
        <div
          className={`h-2 flex-1 rounded-full ${
            step >= 2 ? "bg-[#b7b3f4]" : "bg-[#eeedfc]"
          }`}
        />
        <div
          className={`h-2 flex-1 rounded-full ${
            step >= 3 ? "bg-[#b7b3f4]" : "bg-[#eeedfc]"
          }`}
        />
      </div>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-95 rounded-xl bg-white px-5 pb-6 pt-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:max-w-120 sm:p-12"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePreviousStep}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[#6F6C90] ${
              step === 1 ? "invisible" : ""
            }`}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#8E8E93]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-[32px] font-semibold leading-none tracking-normal text-text">
            Create Account
          </h2>
          <p className="mt-2 font-medium text-sm text-[#666] leading-none tracking-normal">
            Join and start learning today
          </p>
        </div>

        {renderProgress()}

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#3d3d3d]">
                Email*
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="h-12 w-full rounded-lg border border-[#D1D1D1] px-4 text-sm outline-none transition focus:border-[#5446E8] leading-none tracking-normal"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}

              <button
                type="button"
                onClick={handleNextStep}
                className="my-4 h-12 w-full rounded-lg bg-primary-dark text-base font-medium text-white transition hover:bg-[#493DCC] cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                  Password*
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                    className="h-13 w-full rounded-lg border border-[#D1D1D1] px-4 pr-12 text-sm outline-none transition focus:border-[#5446E8]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                  Confirm Password*
                </label>

                <div className="relative">
                  <input
                    type={showPasswordConfirmation ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password_confirmation")}
                    className="h-13 w-full rounded-lg border border-[#D1D1D1] px-4 pr-12 text-sm outline-none transition focus:border-[#5446E8]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="my-4 h-12 w-full rounded-lg bg-primary-dark text-base font-medium text-white transition hover:bg-[#493DCC] cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                  Username*
                </label>

                <input
                  placeholder="Username"
                  {...register("username")}
                  className="h-13 w-full rounded-lg border border-[#D1D1D1] px-4 text-sm outline-none transition focus:border-[#5446E8]"
                />

                {errors.username && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 block text-sm font-medium text-[#3D3D3D]">
                  Upload Avatar
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-34.5 w-full flex-col items-center justify-center rounded-lg border border-[#D1D1D1] px-4 py-6 text-center"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Avatar preview"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <>
                      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-[#9A9A9A]">
                        <Upload size={24} />
                      </span>

                      <p className="text-sm text-[#666]">
                        Drag and drop or{" "}
                        <span className="font-medium text-[#5446E8] underline">
                          Upload file
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-[#A0A0A0]">
                        JPG, PNG or WebP
                      </p>
                    </>
                  )}
                </button>

                {errors.avatar && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

              {errors.root && (
                <p className="text-sm text-red-500">{errors.root.message}</p>
              )}

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-13 w-full rounded-lg bg-[#5446E8] text-base font-medium text-white transition hover:bg-[#493DCC] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {registerMutation.isPending ? "Loading..." : "Sign Up"}
              </button>
            </div>
          )}

          <div className="mt-1">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E5E5E5]" />
              <span className="text-sm text-[#8A8A8A]">or</span>
              <div className="h-px flex-1 bg-[#E5E5E5]" />
            </div>

            <p className="mt-4 text-center text-sm text-[#666] traking-normal leading-none">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-sm text-text underline  traking-normal leading-none cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default RegisterModal;
