<script setup lang="ts">
  import { SelectAll } from '@/features/filter';
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
  import { getDestinations } from '@/widgets/offers';
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  } from '@headlessui/vue';
  import { useUnit } from 'effector-vue/composition';
  import { ChevronDown, X } from 'lucide-vue-next';
  import { onMounted } from 'vue';
  import { useFilterRequestsForm } from '../lib/filter-form';
  import {
    filterSubmitted,
    filterVisibilityChanged,
    type FormValues,
  } from '../model/my-requests-model';

  const { changeFilterVisibility, submitFilter } = useUnit({
    changeFilterVisibility: filterVisibilityChanged,
    submitFilter: filterSubmitted,
  });

  const { form, destination } = useFilterRequestsForm();
  const { data: destinations, start } = useUnit(getDestinations);

  onMounted(start);

  const onSubmit = form.handleSubmit((values) => {
    submitFilter(values as FormValues);
  });
</script>

<template>
  <div class="w-full items-center border-b border-[#D0D4DB] px-0 py-3">
    <Button
      class="flex gap-x-2"
      variant="ghost"
      @click="changeFilterVisibility()">
      <X class="h-7 w-7" color="#000FFC" />
      <p class="text-[16px] font-semibold text-[#000FFC]">Закрыть</p>
    </Button>
  </div>
  <form @submit="onSubmit" class="mt-10 flex w-full flex-col gap-y-4 px-5">
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
    <div class="relative mb-5 inline-block text-left">
      <Listbox v-model="destination" multiple>
        <div class="flex w-full justify-between">
          <p class="pb-2 text-[14px] font-semibold text-[#101828]">
            Назначение
          </p>
          <SelectAll
            :list="destinations?.data.map((v) => v.id)"
            v-model="destination" />
        </div>
        <ListboxButton
          class="inline-flex w-full justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
          <p class="text-[16px] font-normal tracking-wide text-[#858FA3]">
            Назначение
          </p>
          <ChevronDown color="#858FA3" class="h-5 w-5" />
        </ListboxButton>

        <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <ListboxOptions
            class="absolute h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption
              v-if="destinations?.data"
              v-for="item in destinations?.data"
              :value="item.id">
              <li
                :class="
                  cn(
                    'mx-1 my-1 cursor-pointer select-none rounded py-2 pl-3 pr-9 text-gray-900 hover:bg-opacity-90',
                    destination?.find((f) => f === (item?.id ?? 1)) &&
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
  <div
    @click="onSubmit"
    class="mt-auto w-full border-t border-[#CCD0D9] bg-[#F9FAFB] p-4 md:min-w-[305px]">
    <Button class="w-full text-[17px] font-semibold" type="submit">
      Применить фильтр
    </Button>
  </div>
</template>
