import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { type FormContext, useForm } from 'vee-validate';

export function useCreateAdvertisementForm(): {
  form: FormContext<any, {}>;
} {
  const formSchema = toTypedSchema(
    z.object({
      name: z
        .string({ required_error: 'Введите наименование' })
        .min(1, 'Введите наименование'),
      article: z
        .string({ required_error: 'Введите артикул' })
        .min(1, 'Введите артикул'),
      count: z
        .string({ required_error: 'Введите количество' })
        .min(1, 'Введите количество'),
      assigment: z
        .string({ required_error: 'Выберите назначение' })
        .min(1, 'Выберите назначение'),
    }),
  );

  const form = useForm({
    validationSchema: formSchema,
  });

  return {
    form,
  };
}
