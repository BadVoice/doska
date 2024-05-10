import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { type FormContext, useForm } from 'vee-validate';
import type { SearchResponseFilters } from '@/shared/api/generated/Api';

export function useFilter(filters: SearchResponseFilters): {
  form: FormContext<any, {}>;
} {
  const formSchema = toTypedSchema(
    z
      .object({
        denomination: z.string().optional(),
        article: z.string().optional(),
        priceFrom: z.number().nonnegative().optional(),
        priceTo: z.number().nonnegative().optional(),
        countFrom: z.number().nonnegative().optional(),
        countTo: z.number().nonnegative().optional(),
      })
      .refine((values) => {
        if (values.priceFrom && values.priceTo) {
          return values.priceFrom <= values.priceTo;
        } else {
          return true;
        }
      })
      .refine((values) => {
        if (values.countFrom && values.countTo) {
          return values.countFrom <= values.countTo;
        } else {
          return true;
        }
      }),
  );

  const form = useForm({
    validationSchema: formSchema,
  });

  return {
    form,
  };
}
