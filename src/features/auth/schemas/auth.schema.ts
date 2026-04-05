import * as yup from "yup";
import type { InferType } from "yup";

const validImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("შეიყვანე ვალიდური ელფოსტა")
    .min(3, "უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს")
    .required("ელფოსტა სავალდებულოა"),
  password: yup
    .string()
    .min(3, "უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს")
    .required("პაროლი სავალდებულოა"),
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, "username უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს")
    .required("username სავალდებულოა"),
  email: yup
    .string()
    .email("შეიყვანე ვალიდური ელფოსტა")
    .required("email სავალდებულოა"),
  password: yup
    .string()
    .min(3, "password უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს")
    .required("password სავალდებულოა"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "პაროლები არ ემთხვევა")
    .required("confirm password სავალდებულოა"),
  avatar: yup
    .mixed<File>()
    .nullable()
    .notRequired()
    .test("fileType", "დასაშვებია მხოლოდ jpg, png ან webp", (file) => {
      if (!file) return true;
      return validImageTypes.includes(file.type);
    })
    .test("fileSize", "ფაილი არ უნდა იყოს 2MB-ზე მეტი", (file) => {
      if (!file) return true;
      return file.size <= 2 * 1024 * 1024;
    }),
});

export type LoginFormValues = InferType<typeof loginSchema>;
export type RegisterFormValues = InferType<typeof registerSchema>;

export type User = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  fullName: string | null;
  mobileNumber: string | null;
  age: number | null;
  profileComplete: boolean;
};

export type AuthResponse = {
  data: {
    user: User;
    token: string;
  };
};

export type MeResponse = {
  //   [x: string]: string;
  data: User;
};

export type ApiErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};
