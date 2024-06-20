<script lang="ts" setup>
  import { cn } from '@/shared/lib';
  import { Button } from '@/shared/ui/button';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useOfferForm } from '@/widgets/offers/lib/add-offer-schema';
  import {
    formSubmitted,
    offerAddButtonClicked,
  } from '@/widgets/offers/model/offers-model';
  import FormInput from '@/widgets/offers/ui/form-input.vue';
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  } from '@headlessui/vue';
  import { useUnit } from 'effector-vue/composition';
  import { ChevronDown, X } from 'lucide-vue-next';
  import { getDestinations } from '../model/offers-model';

  const { form, destination } = useOfferForm();

  const handleClose = useUnit(offerAddButtonClicked);
  const handleSubmit = useUnit(formSubmitted);
  const { data: destinations } = useUnit(getDestinations);

  const onSubmit = async () => {
    await form.validate();
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
    <ScrollArea class="h-[calc(100vh-41px)] border-l border-[#D0D4DB]">
      <form
        @submit.prevent="onSubmit"
        class="flex h-full flex-col justify-between border-r border-[#D0D4DB] bg-white">
        <div class="flex flex-col gap-y-4 p-4">
          <p class="mb-4 text-[18px] font-semibold text-[#101828]">
            Добавление предложения вручную
          </p>

          <FormInput
            name="supplier"
            label="Поставщик"
            placeholder="Поставщик" />
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
                  class="absolute max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption
                    v-if="destinations?.data"
                    v-for="item in destinations?.data"
                    :value="item.id">
                    <li
                      :class="
                        cn(
                          'mx-1 my-1 cursor-pointer select-none rounded py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100 hover:bg-opacity-90',
                          destination === parseInt(item?.id?.toString() ?? '0') &&
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
        </div>
      </form>
    </ScrollArea>
    <div
      class="w-full border-l border-t border-[#CCD0D9] bg-[#F9FAFB] bg-white p-4 md:min-w-[305px]">
      <Button class="w-full text-[17px] font-semibold" type="submit">
        Добавить
      </Button>
    </div>
  </div>
</template>
