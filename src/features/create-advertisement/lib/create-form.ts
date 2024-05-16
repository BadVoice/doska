import { toTypedSchema } from '@vee-validate/zod';
import { type FormContext, useForm } from 'vee-validate';
import { type Ref } from 'vue';
import * as z from 'zod';

export function useCreateAdvertisementForm(): {
  form: FormContext<any, {}>;
  category: Ref<number | undefined>;
  brand: Ref<number | undefined>;
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
      category: z.number({ required_error: 'Выберите категорию' }),
      brand: z.number({ required_error: 'Выберите бренд' }),
    }),
  );

  const form = useForm({
    validationSchema: formSchema,
  });

  const [category] = form.defineField('category');
  const [brand] = form.defineField('brand');

  return {
    form,
    category,
    brand,
  };
}
