import type { FormContext } from 'vee-validate';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import type { Ref } from 'vue';

export function useOfferForm(): {
  form: FormContext<any, {}>;
  destination: Ref<number | undefined>;
} {
  const schema = toTypedSchema(
    z
      .object({
        supplier: z.string({ required_error: 'Введите поставщика' }),
        name: z.string({ required_error: 'Введите наименование' }),
        price: z.number({ required_error: 'Введите цену' }),
        amount: z
          .number({
            required_error: 'Введите количество',
            invalid_type_error: 'Введите количество',
          })
          .positive({ message: 'Введите количество' }),
        deliveryFrom: z.number().nonnegative().optional(),
        deliveryTo: z.number().nonnegative().optional(),
        article: z.string().optional(),
        destination: z.number().optional(),
      })
      .refine((values) => {
        if (values.deliveryFrom && values.deliveryTo) {
          return values.deliveryFrom <= values.deliveryTo;
        } else {
          return true;
        }
      }),
  );

  const form = useForm({
    validationSchema: schema,
  });

  const [destination] = form.defineField('destination');

  return {
    form,
    destination,
  };
}
