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
  import { ChevronDown, X } from 'lucide-vue-next';
  import { useUnit } from 'effector-vue/composition';
  import { onMounted, onUnmounted } from 'vue';
  import { useCreateAdvertisementForm } from '../lib/create-form';
  import {
    $formMode,
    advertisementTypeSelected,
    createAdvertisementMounted,
    formClosed,
    formSubmitted,
    getBrands,
    getCategories,
  } from '../model/create-advertisement';
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  } from '@headlessui/vue';
  import { cn } from '@/shared/lib';

  const emit = defineEmits(['close']);
  const { advertisementTypeSelected: handleSelectedType, $formMode: formMode } =
    useUnit({
      advertisementTypeSelected,
      $formMode,
    });

  const { data: categories } = useUnit(getCategories);
  const { data: brands } = useUnit(getBrands);

  const { form, category, brand } = useCreateAdvertisementForm();

  const onSubmit = async () => {
    await form.validate();
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
          <Listbox v-model="category">
            <p class="text-[14px] font-semibold text-[#101828]">Категория</p>
            <ListboxButton
              class="inline-flex w-full justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
              <p
                :class="
                  cn(
                    'text-[16px] font-normal tracking-wide text-[#858FA3]',
                    category && 'text-black',
                  )
                ">
                {{
                  categories?.data.find((value) => value.id === category)
                    ?.name ?? 'Категория'
                }}
              </p>
              <ChevronDown color="#858FA3" class="h-5 w-5" />
            </ListboxButton>

            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0">
              <ListboxOptions
                class="max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ListboxOption
                  v-if="categories?.data"
                  v-for="item in categories?.data"
                  :value="item.id">
                  <li
                    :class="
                      cn(
                        'mx-1 my-1 cursor-pointer select-none rounded py-2 pl-3 pr-9 text-gray-900 hover:bg-opacity-90',
                        category === parseInt(item?.id ?? '0') &&
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

          <Listbox v-model="brand">
            <p class="text-[14px] font-semibold text-[#101828]">Бренд</p>
            <ListboxButton
              class="inline-flex w-full justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
              <p
                :class="
                  cn(
                    'text-[16px] font-normal tracking-wide text-[#858FA3]',
                    brand && 'text-black',
                  )
                ">
                {{
                  brands?.data.find((value) => value.id === brand)?.name ??
                  'Бренд'
                }}
              </p>
              <ChevronDown color="#858FA3" class="h-5 w-5" />
            </ListboxButton>

            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0">
              <ListboxOptions
                class="max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ListboxOption
                  v-if="brands?.data"
                  v-for="item in brands?.data"
                  :value="item.id">
                  <li
                    :class="
                      cn(
                        'mx-1 my-1 cursor-pointer select-none rounded py-2 pl-3 pr-9 text-gray-900 hover:bg-opacity-90',
                        brand === parseInt(item?.id ?? '0') &&
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
        </form>
        <div
          class="mt-auto flex w-full items-center justify-center border-t border-[#D0D4DB] p-4">
          <Button @click="onSubmit" class="w-full rounded-[9px] text-[16px]">
            Опубликовать заявку
          </Button>
        </div>
      </template>
    </div>
  </div>
</template>
