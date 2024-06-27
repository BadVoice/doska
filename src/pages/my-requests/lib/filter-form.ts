import { toTypedSchema } from '@vee-validate/zod';
import { useForm, type FormContext } from 'vee-validate';
import type { Ref } from 'vue';
import * as z from 'zod';

export function useFilterRequestsForm(): {
  form: FormContext<any, {}>;
  destination: Ref<number[] | undefined>;
} {
  const formSchema = toTypedSchema(
    z.object({
      name: z.string().optional(),
      article: z.string().optional(),
      count: z
        .number({
          invalid_type_error: 'Введите количество',
        })
        .optional(),
      destinations: z.number().array().optional().default([]),
    }),
  );

  const form = useForm({
    validationSchema: formSchema,
  });

  const [destination] = form.defineField('destinations');

  return {
    form,
    destination,
  };
}
