<script setup lang="ts">
  import { cn } from '@/shared/lib';
  import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
  } from '@/shared/ui';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  } from '@headlessui/vue';
  import { useUnit } from 'effector-vue/composition';
  import { ChevronDown, X } from 'lucide-vue-next';
  import { onMounted, onUnmounted } from 'vue';
  import { useCreateAdvertisementForm } from '../lib/create-form';
  import {
    $advertisementType,
    $formMode,
    advertisementTypeSelected,
    createAdvertisementMounted,
    formClosed,
    formSubmitted,
    getDestinations,
  } from '../model/create-advertisement';

  const emit = defineEmits(['close']);
  const { advertisementTypeSelected: handleSelectedType, $formMode: formMode } =
    useUnit({
      advertisementTypeSelected,
      $formMode,
    });

  const { data: destinations } = useUnit(getDestinations);

  const advertisementType = useUnit($advertisementType);

  const { form, destination } = useCreateAdvertisementForm(
    advertisementType.value,
  );

  const onSubmit = async () => {
    await form.validate();
    console.log(form.errors.value);
    if (Object.keys(form.errors.value).length < 1) {
      emit('close');
      formSubmitted(form.values);
    }
  };

  function handleClose() {
    emit('close');
    formClosed();
  }

  onMounted(() => {
    createAdvertisementMounted();
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
        <img
          src="./assets/backicon.svg"
          class="h-6 w-6 select-none"
          alt="arrow" />
      </Button>
      <p class="cursor-default text-[18px] font-semibold leading-3">
        Размещение {{ advertisementType === 'sell' ? 'объявления' : 'заявки' }}
      </p>
      <Button
        v-if="formMode === 'form'"
        @click="handleClose"
        variant="ghost"
        size="icon"
        class="ml-auto">
        <X class="h-7 w-7 select-none" color="#0017FC" />
      </Button>
    </div>
    <ScrollArea
      class="flex h-[calc(100vh-40px)] w-full flex-col items-center gap-y-10 bg-[#F9FAFB] [&>div>div]:!flex [&>div>div]:h-full [&>div>div]:flex-col">
      <template v-if="formMode === 'selectType'">
        <div class="mt-20 flex flex-col items-center gap-y-4 px-5">
          <img src="./assets/bag.svg" alt="bag" class="h-[60px] w-[60px]" />
          <p class="text-[17px] font-medium">Хотите купить или продать?</p>
        </div>
        <div class="mt-6 flex w-full gap-x-4 px-5">
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
        <form @submit="onSubmit" class="my-5 flex w-full flex-col gap-y-4 px-5">
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
          <FormField
            v-slot="{ componentField }"
            name="price"
            v-if="advertisementType === 'sell'">
            <FormItem>
              <FormLabel>Цена</FormLabel>

              <FormControl>
                <Input
                  class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                  type="number"
                  placeholder="Цена"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-if="advertisementType === 'sell'"
            v-slot="{ componentField }"
            name="available">
            <FormItem>
              <FormLabel>Срок до клиента</FormLabel>

              <FormControl>
                <Input
                  class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                  type="number"
                  placeholder="Срок до клиента"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="relative mb-5 inline-block text-left">
            <Listbox v-model="destination">
              <p class="pb-2 text-[14px] font-semibold text-[#101828]">
                Назначение
              </p>
              <ListboxButton
                class="inline-flex w-full justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
                <p
                  :class="
                    cn(
                      'text-[16px] font-normal tracking-wide text-[#858FA3]',
                      destination && 'text-black',
                    )
                  ">
                  {{
                    destinations?.data?.find(
                      (value) => value.id === destination,
                    )?.name ?? 'Назначение'
                  }}
                </p>
                <ChevronDown color="#858FA3" class="h-5 w-5" />
              </ListboxButton>

              <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption
                    v-if="destinations?.data"
                    v-for="item in destinations?.data"
                    :value="item.id">
                    <li
                      :class="
                        cn(
                          'mx-1 my-1 cursor-pointer select-none rounded py-2 pl-3 pr-9 text-gray-900 hover:bg-opacity-90',
                          destination === parseInt(item?.id ?? '0') &&
                            'bg-gray-200 text-black',
                        )
                      ">
                      <span class="block truncate font-normal">
                        {{ item.name }}
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </Listbox>
          </div>
        </form>
      </template>
    </ScrollArea>
    <div
      v-if="advertisementType"
      class="mt-auto flex w-full items-center justify-center border-t border-[#D0D4DB] p-4">
      <Button @click="onSubmit" class="w-full rounded-[9px] text-[16px]">
        Опубликовать заявку
      </Button>
    </div>
  </div>
</template>
