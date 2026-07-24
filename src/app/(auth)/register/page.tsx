'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormCard } from '@/components/ui/form-card';
import { FormTitle } from '@/components/ui/form-title';
import { FormGrid } from '@/components/ui/from-grid';
import { Input } from '@/components/ui/input';
import { useRegistration } from '@/hooks/auth-hook/use-registration';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';


export default function RegisterPage() {

  const {
     register,
     handleSubmit,
     watch,
     errors, 
     isSubmitting, 
     showPassword, 
     setShowPassword, 
     serverError, 
     onSubmit 
    } = useRegistration();


  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      error={serverError}
      maxWidth={'2xl'}
      header={<FormTitle title="Crear cuenta" logoSrc="/LogoNegro.png" logoAlt="Bum Nation" />}
      footer={
        <>
          <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
            Ya tengo cuenta
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#6BFF3C] hover:bg-[#5de52f] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed text-black font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </>
      }
    >
        <FormGrid columns={1}>
          <Field label="Identificación">
            <Input
              type="text"
              inputMode="numeric"
              error={errors.identification?.message}
              placeholder="Solo números"
              registration={register('identification', {
                required: 'Este campo es requerido',
                pattern: { value: /^\d+$/, message: 'La identificación solo debe contener números' },
              })}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Primer nombre">
              <Input
                type="text"
                placeholder="Primer nombre"
                error={errors.firstName?.message}
                registration={register('firstName', { required: 'Este campo es requerido' })}
              />
            </Field>
            <Field label="Segundo nombre (opcional)">
              <Input
                type="text"
                placeholder="Segundo nombre (opcional)"
                registration={register('middleName')} />
            </Field>
            <Field label="Primer apellido">
              <Input
                type="text"
                error={errors.firstLastName?.message}
                placeholder="Primer apellido"
                registration={register('firstLastName', { required: 'Este campo es requerido' })}
              />

            </Field>
            <Field label="Segundo apellido (opcional)">
              <Input
                type="text"
                placeholder="Segundo apellido (opcional)"
                registration={register('secondLastName')} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Correo electrónico">
              <Input
                type="email"
                placeholder="tu@correo.com"
                error={errors.email?.message}
                registration={register('email', {
                  required: 'Este campo es requerido',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'El email no tiene un formato válido' },
                })}
              />
            </Field>
            <Field label="Teléfono">
              <Input
                type = "tel"
                placeholder="7-15 dígitos"
                error={errors.phone?.message}
                registration={register('phone', {
                  required: 'Este campo es requerido',
                  pattern: { value: /^\d{7,15}$/, message: 'Solo números (7-15 dígitos)' },
                })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contraseña">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  error={errors.password?.message}
                  registration={register('password', {
                    required: 'Este campo es requerido',
                    minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
                  })}
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
              </div>
            </Field>
            <Field label="Confirmar contraseña">
              <Input
                type={showPassword ? 'text' : 'password'}
                error={errors.confirmPassword?.message}
                registration={register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                })}
              />
            </Field>
          </div>
        </FormGrid>
    </FormCard>
  );
}
