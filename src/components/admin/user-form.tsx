'use client';

import { FormEvent, useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { useAdminAction } from '@/hooks/admin/use-admin-action';
import { User } from '@/types';
import { ErrorMessage, PrimaryButton, TextField } from './admin-ui';

interface UserFormProps {
  user?: User;
  onDone: (user: User) => void;
}

// Crea un usuario nuevo o edita los datos de uno existente
export function UserForm({ user, onDone }: UserFormProps) {
  const isEdit = !!user;
  const [values, setValues] = useState({
    identification: user?.identification ?? '',
    firstName: user?.firstName ?? '',
    middleName: user?.middleName ?? '',
    firstLastName: user?.firstLastName ?? '',
    secondLastName: user?.secondLastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    password: '',
  });
  const { run, isPending, error } = useAdminAction();

  const set = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const common = {
      firstName: values.firstName,
      middleName: values.middleName || undefined,
      firstLastName: values.firstLastName,
      secondLastName: values.secondLastName || undefined,
      email: values.email,
      phone: values.phone,
    };
    const result = await run((token) =>
      isEdit
        ? usersApi.update(user.id, common, token)
        : usersApi.create(
            { ...common, identification: values.identification, password: values.password },
            token,
          ),
    );
    if (result) onDone(result);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!isEdit && (
        <TextField
          label="Identificación"
          inputMode="numeric"
          pattern="\d+"
          title="Solo números"
          value={values.identification}
          onChange={set('identification')}
          required
        />
      )}
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Primer nombre" value={values.firstName} onChange={set('firstName')} required />
        <TextField label="Segundo nombre" value={values.middleName} onChange={set('middleName')} />
        <TextField
          label="Primer apellido"
          value={values.firstLastName}
          onChange={set('firstLastName')}
          required
        />
        <TextField
          label="Segundo apellido"
          value={values.secondLastName}
          onChange={set('secondLastName')}
        />
      </div>
      <TextField label="Email" type="email" value={values.email} onChange={set('email')} required />
      <TextField
        label="Teléfono"
        type="tel"
        inputMode="tel"
        pattern="\d{7,15}"
        title="Solo números, entre 7 y 15 dígitos"
        value={values.phone}
        onChange={set('phone')}
        required
      />
      {!isEdit && (
        <TextField
          label="Contraseña"
          type="password"
          minLength={8}
          value={values.password}
          onChange={set('password')}
          required
        />
      )}
      <ErrorMessage message={error} />
      <PrimaryButton type="submit" disabled={isPending} size="lg">
        {isPending ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear usuario'}
      </PrimaryButton>
    </form>
  );
}
