import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  LoginFormValues,
  RegisterFormValues,
} from "../schemas/auth.schema";
import { getMe, loginUser, logoutUser, registerUser } from "../api/auth-api";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterFormValues) => registerUser(data),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginUser(data),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useMe() {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
}
