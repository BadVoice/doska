<script lang="ts" setup>
  import { Button } from '@/shared/ui/button';
  import { X } from 'lucide-vue-next';
  import FormInput from '@/widgets/offers/ui/form-input.vue';
  import { useUnit } from 'effector-vue/composition';
  import {
    formSubmitted,
    offerAddButtonClicked,
  } from '@/widgets/offers/model/offers-model';
  import { useOfferForm } from '@/widgets/offers/lib/add-offer-schema';

  const { form } = useOfferForm();

  const handleClose = useUnit(offerAddButtonClicked);
  const handleSubmit = useUnit(formSubmitted);

  const onSubmit = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      handleSubmit({ ...form.values });
    }
  };
</script>

<template>
  <div
    class="flex h-screen w-full flex-col justify-between bg-white lg:max-w-[355px]">
    <div
      class="flex cursor-pointer items-center justify-between gap-x-2 border-b border-l border-r border-[#D0D4DB] px-2 py-4">
      <div class="group flex items-center gap-x-2" @click="handleClose">
        <Button variant="ghost" size="icon">
          <X class="h-7 w-7 text-primary group-hover:text-primary/70" />
        </Button>
        <p
          class="text-center text-[17px] text-primary group-hover:text-primary/70">
          Закрыть
        </p>
      </div>
    </div>

    <form
      @submit.prevent="onSubmit"
      class="flex h-[calc(100%-64px)] flex-col justify-between border-l border-r border-[#D0D4DB] bg-white">
      <div class="flex flex-col gap-y-4 p-4">
        <p class="mb-4 text-[18px] font-semibold text-[#101828]">
          Добавление предложения вручную
        </p>

        <FormInput name="supplier" label="Поставщик" placeholder="Поставщик" />
        <FormInput
          name="name"
          label="Наименование"
          placeholder="Наименование" />
        <FormInput
          number
          name="amount"
          label="Количество"
          placeholder="Количество" />

        <div class="flex w-full flex-col justify-between gap-y-2">
          <p class="text-[13px] font-semibold text-[#101828]">Срок</p>
          <div class="flex w-full justify-between gap-x-4">
            <FormInput number name="deliveryFrom" placeholder="От" />
            <FormInput number name="deliveryTo" placeholder="До" />
          </div>
        </div>
        <FormInput name="article" label="Артикул" placeholder="Артикул" />
        <FormInput name="purpose" label="Назначение" placeholder="Назначение" />
      </div>

      <div
        class="w-full border-t border-[#CCD0D9] bg-[#F9FAFB] p-4 md:min-w-[305px]">
        <Button class="w-full text-[17px] font-semibold" type="submit">
          Добавить
        </Button>
      </div>
    </form>
  </div>
</template>
