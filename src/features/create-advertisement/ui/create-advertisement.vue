<script setup lang="ts">
  import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
  } from '@/shared/ui';
  import { ChevronLeft, X } from 'lucide-vue-next';
  import {
    $formMode,
    advertisementTypeSelected,
    formClosed,
    formSubmitted,
    type FormValues,
  } from '../model/create-advertisement';
  import { useUnit } from 'effector-vue/composition';
  import { useCreateAdvertisementForm } from '../lib/create-form';
  import { onMounted, onUnmounted } from 'vue';

  const emit = defineEmits(['close']);
  const { advertisementTypeSelected: handleSelectedType, $formMode: formMode } =
    useUnit({
      advertisementTypeSelected,
      $formMode,
    });

  const { form } = useCreateAdvertisementForm();

  const onSubmit = form.handleSubmit((values) => {
    emit('close');
    formSubmitted(values as FormValues);
  });

  function handleClose() {
    emit('close');
    formClosed();
  }

  onMounted(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    });
  });

  onUnmounted(() =>
    document.removeEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    }),
  );
</script>

<template>
  <div
    class="absolute bottom-0 left-0 top-0 flex h-screen w-full flex-col items-center border-b border-r border-[#D0D4DB] bg-white md:max-w-[356px]">
    <div
      class="flex w-full items-center justify-start gap-x-2 border-b border-[#D0D4DB] px-4 py-2">
      <Button class="-ml-2" @click="handleClose" size="icon" variant="ghost">
        <ChevronLeft class="h-7 w-7 select-none" color="#0017FC" />
      </Button>
      <p class="cursor-default text-[18px] font-semibold leading-3">
        Размещение заявки
      </p>
      <Button
        v-if="formMode === 'form'"
        variant="ghost"
        size="icon"
        @click="form.resetForm()"
        class="ml-auto">
        <X class="h-7 w-7 select-none" color="#0017FC" />
      </Button>
    </div>
    <div
      class="flex h-full w-full flex-col items-center gap-y-10 bg-[#F9FAFB] pt-20">
      <template v-if="formMode === 'selectType'">
        <div class="flex flex-col items-center gap-y-4 px-5">
          <img src="./assets/bag.svg" alt="bag" class="h-[60px] w-[60px]" />
          <p class="text-[17px] font-medium">Хотите купить или продать?</p>
        </div>
        <div class="flex w-full gap-x-4 px-5">
          <Button
            class="w-full rounded-[10px] text-[16px]"
            @click="handleSelectedType('buy')"
            >Купить</Button
          >
          <Button
            class="w-full rounded-[10px] text-[16px]"
            @click="handleSelectedType('sell')"
            >Продать</Button
          >
        </div>
      </template>
      <template v-else>
        <form
          @submit="onSubmit"
          class="-mt-10 flex w-full flex-col gap-y-4 px-5">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Наименование</FormLabel>
              <FormControl>
                <Input
                  class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                  type="text"
                  placeholder="Наименование"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="article">
            <FormItem>
              <FormLabel>Артикул</FormLabel>
              <FormControl>
                <Input
                  class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                  type="text"
                  placeholder="Артикул"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="count">
            <FormItem>
              <FormLabel>Количество</FormLabel>

              <FormControl>
                <Input
                  class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                  type="number"
                  placeholder="Количество"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="assigment">
            <FormItem>
              <FormLabel>Назначение</FormLabel>
              <FormControl>
                <Input
                  class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                  type="text"
                  placeholder="Назначение"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <div
          @click="onSubmit"
          class="mt-auto flex w-full items-center justify-center border-t border-[#D0D4DB] p-4">
          <Button class="w-full rounded-[9px] text-[16px]">
            Опубликовать заявку
          </Button>
        </div>
      </template>
    </div>
  </div>
</template>
