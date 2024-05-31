<script lang="ts" setup>
  import { Button } from '@/shared/ui/button';
  import { X } from 'lucide-vue-next';
  import { useFilter } from '../lib/schema';
  import FilterInput from './filter-input.vue';
  import { computed, defineProps, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  } from '@headlessui/vue';
  import { useUnit } from 'effector-vue/composition';
  import { searchQuery } from '@/entities/offer';
  import { $selectedAdvertisement } from '@/entities/advertisement';
  import SelectAll from '@/features/filter/ui/select-all.vue';
  import { ScrollArea } from '@/shared/ui/scroll-area';

  defineProps<{
    isFilterCardOpen: boolean;
  }>();

  const selectedVendors = ref<string[]>([]);
  const selectedBrands = ref<string[]>([]);

  interface City {
    id: number;
    title: string;
  }

  const selectedCities = ref<City[]>([]);

  const { start: startSearch, data } = useUnit(searchQuery);

  const { form } = useFilter(data?.value?.data.filters as any);

  const route = useRoute();
  const router = useRouter();

  const search = useUnit($selectedAdvertisement);

  const emit = defineEmits([
    'close-filter-card',
    'filtered-items-came',
    'filterChanged',
  ]);

  let filterParams = computed(() => {
    const params = { ...route.query };

    for (const key in form.values) {
      if (form.values[key]) {
        params[key] = form.values[key];
      }
    }

    if (data?.value?.data.filters?.vendors) {
      params.vendors = selectedVendors.value.join(',');
    }

    if (data?.value?.data.filters?.brands) {
      params.brands = selectedBrands.value.join(',');
    }

    if (data?.value?.data.filters?.cities) {
      const cityIds = selectedCities.value.map((city) => city.id as number);
      params.cities = cityIds.join(',');
    }

    return params;
  });

  const updateUrl = (params: any) => {
    const query = {
      search: route.query.search,
      'active-pre-search': route.query['active-pre-search'],
      ...params,
    };
    router.replace({ query });
  };

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    await form.validate();

    if (Object.keys(form.errors.value).length === 0) {
      const values = form.values;
      const vendors = selectedVendors.value;
      const brands = selectedBrands.value;
      const cityIds = selectedCities.value.map((city) => city.id as number);
      const filterParamsValue = filterParams.value;
      updateUrl(filterParamsValue);

      startSearch({
        search: search.value?.article ?? '',
        page_size: 10,
        brand: search.value?.brand ?? '',
        filters: {
          name: values.denomination,
          article: values.article,
          price: {
            from: values.priceFrom,
            to: values.priceTo,
          },
          delivery: {
            from: values.countFrom,
            to: values.countTo,
          },
        },
        exclude: {
          brand: brands,
          vendor: vendors,
          city_id: cityIds,
        },
      });

      closeFilter();
    }
  };

  const showClearButton = ref(false);

  watch(form.values, () => {
    for (const key of Object.keys(form.values)) {
      if (form.isFieldDirty(key)) {
        showClearButton.value = true;
      }
    }
  });

  function closeFilter() {
    showClearButton.value = false;
    emit('close-filter-card', false);
  }
</script>

<template>
  <div
    v-if="isFilterCardOpen"
    class="flex max-h-screen w-full flex-col justify-between overflow-y-hidden bg-white lg:max-w-[355px]">
    <div
      class="flex cursor-pointer items-center justify-between gap-x-2 border-b border-l border-r border-[#D0D4DB] px-2 py-4">
      <div class="group flex items-center gap-x-2" @click="closeFilter">
        <Button variant="ghost" size="icon">
          <X class="h-7 w-7 text-primary group-hover:text-primary/70" />
        </Button>
        <p
          class="text-center text-[17px] text-primary group-hover:text-primary/70">
          Закрыть
        </p>
      </div>

      <Button
        variant="ghost"
        v-if="showClearButton"
        @click="
          () => {
            form.resetForm();
            closeFilter();
          }
        "
        class="group flex cursor-pointer items-center gap-x-2 px-2 py-2">
        <p
          class="text-center text-[17px] font-normal text-primary group-hover:text-primary/70">
          Очистить
        </p>
      </Button>
    </div>

    <form
      @submit="onSubmit"
      class="flex h-[calc(100%-64px)] flex-col justify-between border-l border-r border-[#D0D4DB] bg-white">
      <ScrollArea>
        <div class="flex flex-col gap-y-4 p-4">
          <p class="text-[20px] font-semibold text-[#101828]">Фильтр</p>

          <FilterInput
            name="denomination"
            label="Наименование"
            placeholder="Наименование" />
          <FilterInput name="article" label="Артикул" placeholder="Артикул" />

          <div class="relative inline-block text-left">
            <Listbox v-model="selectedCities" multiple>
              <div class="flex w-full items-center justify-between">
                <p class="py-2 text-[13px] font-semibold text-[#101828]">
                  Населенный пункт
                </p>
                <SelectAll
                  :list="data?.data?.filters?.cities"
                  v-model="selectedCities" />
              </div>

              <ListboxButton
                class="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
                <p class="text-sm font-normal text-gray-400">
                  Населенный пункт
                </p>
              </ListboxButton>
              <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <RecycleScroller
                    class="scroller flex h-full flex-col"
                    :items="data?.data?.filters?.cities"
                    :item-size="46"
                    key-field="id"
                    v-slot="{ item }">
                    <ListboxOption :key="item.id" :value="item" as="template">
                      <li
                        class="mx-1 my-1 cursor-pointer select-none rounded bg-blue-200 py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-100"
                        :class="{
                          'bg-gray-50 text-black ': selectedCities.some(
                            (city) => city.id === item.id,
                          ),
                        }">
                        <span class="block truncate font-normal">
                          {{ item.title }}</span
                        >
                      </li>
                    </ListboxOption>
                  </RecycleScroller>
                </ListboxOptions>
              </transition>
            </Listbox>
          </div>

          <div class="flex w-full flex-col justify-between gap-y-2">
            <p class="text-[13px] font-semibold text-[#101828]">Цена</p>
            <div class="flex w-full justify-between gap-x-4">
              <FilterInput number name="priceFrom" placeholder="От" />
              <FilterInput number name="priceTo" placeholder="До" />
            </div>
          </div>

          <div class="flex w-full flex-col justify-between gap-y-2">
            <p class="text-[13px] font-semibold text-[#101828]">Наличие</p>
            <div class="flex w-full justify-between gap-x-4">
              <FilterInput number name="countFrom" placeholder="От" />
              <FilterInput number name="countTo" placeholder="До" />
            </div>
          </div>

          <div class="relative inline-block text-left">
            <Listbox v-model="selectedVendors" multiple>
              <div class="flex w-full items-center justify-between">
                <p class="py-2 text-[13px] font-semibold text-[#101828]">
                  Поставщик
                </p>
                <SelectAll
                  :list="data?.data?.filters?.vendors"
                  v-model="selectedVendors" />
              </div>

              <ListboxButton
                class="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
                <p class="text-sm font-normal text-gray-400">Поставщик</p>
              </ListboxButton>

              <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <RecycleScroller
                    class="scroller flex h-full flex-col"
                    :items="data?.data?.filters?.vendors"
                    :item-size="46"
                    key-field="id"
                    v-slot="{ item }">
                    <ListboxOption :key="item" :value="item" as="template">
                      <li
                        class="mx-1 my-1 cursor-pointer select-none rounded bg-blue-200 py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-100"
                        :class="{
                          'bg-gray-50 text-black ':
                            selectedVendors.includes(item),
                        }">
                        <span class="block truncate font-normal">{{
                          item
                        }}</span>
                      </li>
                    </ListboxOption>
                  </RecycleScroller>
                </ListboxOptions>
              </transition>
            </Listbox>
          </div>

          <div class="relative inline-block text-left">
            <Listbox v-model="selectedBrands" multiple>
              <div class="flex w-full items-center justify-between">
                <p class="pb-2 text-[13px] font-semibold text-[#101828]">
                  Бренд
                </p>
                <SelectAll
                  :list="data?.data?.filters?.vendors"
                  v-model="selectedVendors" />
              </div>

              <ListboxButton
                class="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
                <p class="text-sm font-normal text-gray-400">Бренд</p>
              </ListboxButton>
              <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute top-0 z-10 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <RecycleScroller
                    class="scroller flex h-full flex-col"
                    :items="data?.data?.filters?.brands"
                    :item-size="46"
                    key-field="id"
                    v-slot="{ item }">
                    <ListboxOption :key="item" :value="item" as="template">
                      <li
                        class="mx-1 my-1 cursor-pointer select-none rounded bg-blue-200 py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-100"
                        :class="{
                          'bg-gray-50 text-black ':
                            selectedBrands.includes(item),
                        }">
                        <span class="block truncate font-normal">{{
                          item
                        }}</span>
                      </li>
                    </ListboxOption>
                  </RecycleScroller>
                </ListboxOptions>
              </transition>
            </Listbox>
          </div>
        </div>
      </ScrollArea>

      <div
        class="w-full border-t border-[#CCD0D9] bg-[#F9FAFB] p-4 md:min-w-[305px]">
        <Button class="w-full text-[17px] font-semibold" type="submit">
          Применить фильтр
        </Button>
      </div>
    </form>
  </div>
</template>
