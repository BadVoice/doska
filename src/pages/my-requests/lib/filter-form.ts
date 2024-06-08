import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { type FormContext, useForm } from 'vee-validate';

export function useFilterRequestsForm(): {
  form: FormContext<any, {}>;
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
      assigment: z.string().optional(),
    }),
  );

  const form = useForm({
    validationSchema: formSchema,
  });

  return {
    form,
  };
}
