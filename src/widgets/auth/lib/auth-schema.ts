import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { type FormContext, useForm } from 'vee-validate';
import { type TInputMode } from '@/widgets/auth/model/auth-model';

export function useAuthForm(schemaMode: TInputMode): {
  form: FormContext<any, {}>;
} {
  const schemaWithEmail = toTypedSchema(
    z.object({
      name: z.string({ required_error: 'Введите имя' }),
      email: z
        .string({ required_error: 'Введите почту' })
        .email({ message: 'Введите почту' }),
    }),
  );

  const schemaWithPhone = toTypedSchema(
    z.object({
      name: z.string({ required_error: 'Введите имя' }),
      phone: z.string({ required_error: 'Введите номер телефона' }),
    }),
  );

  const form = useForm({
    validationSchema:
      schemaMode === 'phone' ? schemaWithEmail : schemaWithPhone,
  });

  return {
    form,
  };
}

export function usePhoneOrEmailForm(): {
  form: FormContext<any, {}>;
} {
  const schema = toTypedSchema(
    z.object({
      value: z.string({ required_error: 'Введите телефон или почту' }),
    }),
  );

  const form = useForm({
    validationSchema: schema,
  });

  return {
    form,
  };
}
