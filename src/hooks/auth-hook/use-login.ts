import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

  interface LoginFormData {
  identification: string;
  password: string;
}

  
export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: { identification: '', password: '' },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const { user } = await authApi.login(data.identification, data.password);
      setAuth(user);
      toast.success(`Bienvenido, ${user.firstName}`);
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Identificación o contraseña incorrectas.');
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
  }
}