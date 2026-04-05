import { publicInstance, privateInstance } from "./axios";
import type {
  LoginFormValues,
  RegisterFormValues,
  AuthResponse,
  MeResponse,
} from "./../schemas/auth.schema";

export async function registerUser(data: RegisterFormValues) {
  const formData = new FormData();

  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.password_confirmation);

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }

  const response = await publicInstance.post<AuthResponse>(
    "/register",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function loginUser(data: LoginFormValues) {
  const response = await publicInstance.post<AuthResponse>("/login", data);
  return response.data;
}

export async function getMe() {
  const response = await privateInstance.get<MeResponse>("/me");
  return response.data;
}

export async function logoutUser() {
  const response = await privateInstance.post("/logout");
  return response.data;
}
