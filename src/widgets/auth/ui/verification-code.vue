<script setup lang="ts">
  import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    PinInput,
    PinInputGroup,
    PinInputInput,
  } from '@/shared/ui';
  import { useAuthForm } from '@/widgets/auth/lib/auth-schema';
  import { $inputMode, $phoneOrEmail } from '@/widgets/auth/model/auth-model';
  import { useUnit } from 'effector-vue/composition';
  import { ref } from 'vue';
  import { handleNextForm } from '@/widgets/auth/lib/form-mode';

  const nextModal = useUnit(handleNextForm);
  const phoneStore = useUnit($phoneOrEmail);
  const inputMode = useUnit($inputMode);

  const registerError = ref(false);

  const { form } = useAuthForm(inputMode.value);

  const onSubmit = () => {
    nextModal('details');
  };

  const value = ref<string[]>([]);
  const handleComplete = (e: string[]) => alert(e.join(''));
</script>

<template v-else>
  <div class="flex h-full flex-col justify-between">
    <form @submit="onSubmit" class="mt-4 flex w-full flex-col gap-y-4 px-4">
      <p class="text-[18px] font-semibold">Введите проверочный код</p>
      <p v-if="phoneStore" class="text-[18px] font-semibold">
        Мы отправили код на ваш номер телефона +7 (***) ***{{
          phoneStore.slice(-5)
        }}
      </p>
      <p v-if="registerError" class="text-[14px] font-semibold text-[#858FA3]">
        Произошла ошибка, возможно такие данные уже существуют
      </p>
      <FormField v-slot="{ componentField, value }" name="pin">
        <FormItem>
          <FormControl>
            <PinInput
              id="pin-input"
              v-model="value!"
              placeholder="*"
              class="mt-1 flex items-center gap-2 text-[24px] font-semibold text-[#0017FC]"
              otp
              type="number"
              :name="componentField.name"
              @complete="handleComplete"
              @update:model-value="(arrStr) => {}">
              <PinInputGroup class="gap-2">
                <PinInputInput
                  class="min-h-[47px] min-w-[47px] rounded-lg border border-[#CCD0D9] text-[24px]"
                  v-for="(id, index) in 5"
                  :key="id"
                  :index="index" />
              </PinInputGroup>
            </PinInput>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </form>
    <div
      class="inset-x-0 bottom-0 w-full border-t border-[#CCD0D9] bg-white p-4">
      <Button @click="onSubmit" class="w-full text-[17px] font-semibold"
        >Продолжить</Button
      >
    </div>
  </div>
</template>
