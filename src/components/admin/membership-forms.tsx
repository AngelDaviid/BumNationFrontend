'use client';

import { FormEvent, useState } from 'react';
import { membershipApi } from '@/lib/api/membership';
import { useAdminAction } from '@/hooks/admin/use-admin-action';
import { addMonths, toDateInput } from '@/common/formatted-date';
import { GymMembership } from '@/types';
import { ErrorMessage, PrimaryButton, TextAreaField, TextField } from './admin-ui';

// La renovación arranca el día en que vence la membresía (o hoy, si ya venció)
function defaultRenewalStart(nextPaymentDate: string) {
  const next = new Date(nextPaymentDate);
  return next > new Date() ? next : new Date();
}

export function RenewMembershipForm({
  userId,
  nextPaymentDate,
  onDone,
}: {
  userId: string;
  nextPaymentDate: string;
  onDone: (membership: GymMembership) => void;
}) {
  const start = defaultRenewalStart(nextPaymentDate);
  const [amount, setAmount] = useState('');
  const [validFrom, setValidFrom] = useState(toDateInput(start));
  const [validUntil, setValidUntil] = useState(toDateInput(addMonths(start, 1)));
  const [notes, setNotes] = useState('');
  const { run, isPending, error, setError } = useAdminAction();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!(Number(amount) > 0)) return setError('Ingresa un valor mayor a 0.');
    if (validUntil <= validFrom) return setError('La fecha final debe ser posterior a la inicial.');

    const result = await run((token) =>
      membershipApi.renew(
        userId,
        { amount: Number(amount), validFrom, validUntil, notes: notes || undefined },
        token,
      ),
    );
    if (result) onDone(result);
  }

  function setMonths(months: number) {
    setValidUntil(toDateInput(addMonths(validFrom, months)));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        label="Valor pagado (COP)"
        type="number"
        min={1}
        inputMode="numeric"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Ej. 90000"
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Válida desde"
          type="date"
          value={validFrom}
          onChange={(e) => setValidFrom(e.target.value)}
          required
        />
        <TextField
          label="Válida hasta"
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {[1, 3, 6, 12].map((months) => (
          <button
            key={months}
            type="button"
            onClick={() => setMonths(months)}
            className="cursor-pointer rounded-full border border-zinc-700 px-3 py-1 text-zinc-300 hover:border-[#6BFF3C] hover:text-[#6BFF3C]"
          >
            {months === 12 ? '1 año' : `${months} ${months === 1 ? 'mes' : 'meses'}`}
          </button>
        ))}
      </div>
      <TextAreaField
        label="Notas (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Ej. Pago en efectivo"
      />
      <ErrorMessage message={error} />
      <PrimaryButton type="submit" disabled={isPending} size="lg">
        {isPending ? 'Registrando…' : 'Registrar pago y renovar'}
      </PrimaryButton>
    </form>
  );
}

export function CreateMembershipForm({
  userId,
  onDone,
}: {
  userId: string;
  onDone: (membership: GymMembership) => void;
}) {
  const [startDate, setStartDate] = useState(toDateInput(new Date()));
  const [nextPaymentDate, setNextPaymentDate] = useState(
    toDateInput(addMonths(new Date(), 1)),
  );
  const { run, isPending, error, setError } = useAdminAction();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (nextPaymentDate <= startDate) {
      return setError('El próximo pago debe ser posterior a la fecha de inicio.');
    }
    const result = await run((token) =>
      membershipApi.create(userId, { startDate, nextPaymentDate }, token),
    );
    if (result) onDone(result);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Fecha de inicio"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <TextField
          label="Próximo pago"
          type="date"
          value={nextPaymentDate}
          onChange={(e) => setNextPaymentDate(e.target.value)}
          required
        />
      </div>
      <p className="text-xs text-zinc-500">
        Después de crearla, registra el primer pago con &quot;Renovar&quot;.
      </p>
      <ErrorMessage message={error} />
      <PrimaryButton type="submit" disabled={isPending} size="lg">
        {isPending ? 'Creando…' : 'Crear membresía'}
      </PrimaryButton>
    </form>
  );
}
