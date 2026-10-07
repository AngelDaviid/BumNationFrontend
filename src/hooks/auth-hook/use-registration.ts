import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { RegisterData } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

export const useRegistration = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      identification: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: RegisterFormData) {

    const { confirmPassword, ...rest } = data;
    const payload: RegisterData = {
      ...rest,
      middleName: rest.middleName?.trim() || undefined,
      secondLastName: rest.secondLastName?.trim() || undefined,
    };

    try {
      const { user } = await authApi.register(payload);
      setAuth(user);
      toast.success('Cuenta creada, ¡bienvenido a Bum Nation!');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('No se pudo crear la cuenta. Verifica tus datos e intenta de nuevo.');
    }
  }

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    onSubmit,
  }
}

