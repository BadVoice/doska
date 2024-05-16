import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { type FormContext, useForm } from 'vee-validate';

export function useCompanyForm(): {
    form: FormContext<any, {}>;
} {
    const schema = toTypedSchema(
        z.object({
            name: z.string({ required_error: 'Введите почту' }),
            phone: z.string({ required_error: 'Введите телефон' }),
            email: z.string({ required_error: 'Введите почту' }),
        }),
    );

    const form = useForm({
        validationSchema: schema,
    });

    return {
        form,
    };
}

