import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

  interface LoginFormData {
  identification: string;
  password: string;
}

  
export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: { identification: '', password: '' },
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    try {
      const { access_token, user } = await authApi.login(data.identification, data.password);
      setAuth(access_token, user);
      router.push('/');
    } catch {
      setServerError('Identificación o contraseña incorrectas.');
    }
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    serverError,
  }
}