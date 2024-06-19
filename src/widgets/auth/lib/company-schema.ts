import { toTypedSchema } from '@vee-validate/zod';
import { type FormContext, useForm } from 'vee-validate';
import * as z from 'zod';

export function useCompanyForm(): {
  form: FormContext<any, {}>;
} {
  const schema = toTypedSchema(
    z.object({
      legalForm: z.enum(['ООО', 'ИП', 'ПАО', 'АО'], {
        required_error: 'Выберите правовую форму',
      }),
      name: z.string({ required_error: 'Введите наименование' }),
      nalog: z.enum(['с НДС', 'без НДС'], {
        required_error: 'Выберите систему налогообложения',
      }),
      position: z.string({ required_error: 'Введите должность' }),
      continueAsCompany: z.boolean().default(true),
    }),
  );

  const form = useForm({
    validationSchema: schema,
  });

  return {
    form,
  };
}
