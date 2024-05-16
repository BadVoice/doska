import { toTypedSchema } from '@vee-validate/zod';
import { type FormContext, useForm } from 'vee-validate';
import { type Ref } from 'vue';
import * as z from 'zod';

export function useCreateAdvertisementForm(): {
  form: FormContext<any, {}>;
  assigment: Ref<number | undefined>;
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
        .number({
          required_error: 'Введите количество',
          invalid_type_error: 'Введите количество',
        })
        .min(1, 'Введите количество'),
      assigment: z.number({ required_error: 'Выберите назначение' }),
    }),
  );

  const form = useForm({
    validationSchema: formSchema,
  });

  const [assigment] = form.defineField('assigment');

  return {
    form,
    assigment,
  };
}
