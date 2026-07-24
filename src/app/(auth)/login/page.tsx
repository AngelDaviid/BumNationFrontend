'use client';

import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '@/hooks/auth-hook/use-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { FormTitle } from '@/components/ui/form-title';
import { FormGrid } from '@/components/ui/from-grid';
import { FormCard } from '@/components/ui/form-card';

export default function LoginPage() {
  const {
    register, handleSubmit, onSubmit, errors,
    isSubmitting, showPassword, setShowPassword, serverError,
  } = useLogin();

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      error={serverError}
      header={<FormTitle title="Iniciar sesión" logoSrc="/LogoNegro.png" logoAlt="Bum Nation" />}
      footer={
        <>
          <Link href="/register" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
            Crear cuenta
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </>
      }
    >
      <FormGrid columns={1}>
        <Field label="Identificación">
          <Input
            type="text"
            error={errors.identification?.message}
            placeholder="Ingresa tu identificación"
            registration={register('identification', { required: 'Este campo es requerido' })}
          />
        </Field>

        <Field label="Contraseña">
          <Input
            type={showPassword ? 'text' : 'password'}
            error={errors.password?.message}
            placeholder="••••••••"
            registration={register('password', { required: 'Este campo es requerido' })}
            rightElement={
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPassword((v) => !v)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            }
          />
        </Field>
      </FormGrid>
    </FormCard>
  );
}