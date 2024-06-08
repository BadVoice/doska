import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { type FormContext, useForm } from 'vee-validate';

export function useCompanyForm(): {
  form: FormContext<any, {}>;
} {
  const schema = toTypedSchema(
    z.object({
      legalForm: z.string({ required_error: 'Введите правовую форму' }),
      name: z.string({ required_error: 'Введите наименование' }),
      category: z.enum(['osn', 'usn', 'envd', 'psn'], {
        required_error: 'Выберите категорию',
      }),
      nalog: z.enum(['osn', 'usn', 'envd', 'psn'], {
        required_error: 'Выберите систему налогообложения',
      }),
      address: z.string({ required_error: 'Введите адрес' }),
      sellerOrBuyer: z.enum(['buyer', 'seller'], {
        required_error: 'Выберите роль',
      }),
      position: z.string({ required_error: 'Введите должность' }),
      continueAsCompany: z.boolean().optional(),
    }),
  );

  const form = useForm({
    validationSchema: schema,
  });

  return {
    form,
  };
}
