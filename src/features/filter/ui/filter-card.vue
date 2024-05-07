<script lang="ts" setup>
  import { Button } from '@/shared/ui/button';
  import { X } from 'lucide-vue-next';
  import { useFilter } from '../lib/schema';
  import FilterInput from './filter-input.vue';
  import { computed, defineProps, ref, watch } from 'vue';
  import { getSearchService } from '@/shared/api/api';
  import { useRoute, useRouter } from 'vue-router';

  import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';

  import type { SearchPagination, SearchResponseFilters } from '@/shared/api/generated/data-contracts';

  defineProps<{
    isFilterCardOpen: boolean;
  }>();

  const filter = defineModel<SearchResponseFilters>('filters', {
    required: true,
  });

  const pagination = defineModel<SearchPagination>('pagination', {
    required: true,
  });

  const selectedVendors = ref([] as string[]);
  const selectedBrands = ref(["none"] as string[]);


  interface City {
    id: number;
    title: string;
  }
  watch(
    () => filter.value,
    (newFilter, oldFilter) => {
      filter.value = newFilter;
    },
    { deep: true }
  );

  const selectedCities = ref([] as City[]);

  const { form } = useFilter(filter.value);

  const initialVendors = ref([...selectedVendors.value]);
  const initialBrands = ref([...selectedBrands.value]);
  const initialCities = ref([...selectedCities.value]);
  const initialPriceFrom = ref(form.values.priceFrom);
  const initialPriceTo = ref(form.values.priceTo);
  const initialCountFrom = ref(form.values.countFrom);
  const initialCountTo = ref(form.values.countTo);

  const route = useRoute();
  const router = useRouter();
  const search = computed(() => route.query.search);

  const emit = defineEmits(['close-filter-card', 'filtered-items-came', 'filterChanged']);
  function closeFilter() {
    emit('close-filter-card', false);
  }

  let filterParams = computed(() => {
    const params = { ...route.query };

    for (const key in form.values) {
      if (form.values[key]) {
        params[key] = form.values[key];
      }
    }

    if (filter.value.vendors) {
      params.vendors = selectedVendors.value.join(',');
    }

    if (filter.value.brands) {
      params.brands = selectedBrands.value.join(',');
    }

    if (filter.value.cities) {
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
  
  const onSubmit = (event: Event) => {
    event.preventDefault();
    form.validate();
    if (Object.keys(form.errors.value).length === 0) {
      (async () => {
        const values = form.values;
        const vendors = selectedVendors.value;
        const brands = selectedBrands.value;
        const cityIds = selectedCities.value.map((city) => city.id as number);
        try {
          const filterParamsValue = filterParams.value;
          updateUrl(filterParamsValue);
          const items = await getSearchService({
            search: search.value?.toString() as string,
            page_size: 10,
            page: pagination.value.page,
            brand: route.query['active-pre-search'] as string,
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
            }
          });
          emit('filtered-items-came', items.items);
          pagination.value = {
            items_count: items.items_count as number,
            has_next: items.has_next as boolean,
            has_prev: items.has_prev as boolean,
            page: items.page as number,
            pages: items.pages as number,
          };
        } catch (error) {
          console.error(error);
        }
      })();
    }
  };


  const resetForm = () => {

    selectedVendors.value = [];
    selectedBrands.value = [];
    selectedCities.value = [];

    form.values.denomination = '';
    form.values.article = '';
    form.values.priceFrom = '';
    form.values.priceTo = '';
    form.values.countFrom = '';
    form.values.countTo = '';

    onSubmit(new Event('submit') );
    updateUrl({});
  }

  const showClearButton = computed(() => {
    return (
      form.values.denomination?.length > 0 ||
      form.values.article?.length > 0 ||
      form.values.priceFrom !== initialPriceFrom.value ||
      form.values.priceTo !== initialPriceTo.value ||
      form.values.countFrom !== initialCountFrom.value ||
      form.values.countTo !== initialCountTo.value ||

      selectedVendors.value.length !== initialVendors.value.length ||
      selectedBrands.value.length !== initialBrands.value.length ||
      selectedCities.value.length !== initialCities.value.length

    );
  });
</script>

<template>
  <div
    v-if="isFilterCardOpen"
    class="flex h-screen w-full flex-col bg-white justify-between  lg:max-w-[355px]">
    <div
      @click="closeFilter"
      class=" flex cursor-pointer justify-between items-center gap-x-2 border-b border-l border-r border-[#D0D4DB] px-2 py-4">
    <div class="flex group items-center gap-x-2">
      <Button variant="ghost" size="icon">
        <X class="h-7 w-7 text-primary group-hover:text-primary/70" />
      </Button>
      <p
        class="text-center text-[17px] text-primary group-hover:text-primary/70">
        Закрыть
      </p>
    </div>
      <div>
        <div
          v-if="showClearButton"  @click="resetForm"
          class="group flex cursor-pointer items-center gap-x-2  px-2 py-2">
          <p
            class="text-center text-[17px] text-primary group-hover:text-primary/70">
            Очистить
          </p>
        </div>
      </div>
    </div>

    <form
      @submit="onSubmit"
      class="flex flex-col h-[calc(100%-64px)] bg-white justify-between border-l border-r border-[#D0D4DB]">
      <div class="flex flex-col gap-y-4 p-4">
        <p class="text-[20px] font-semibold text-[#101828]">Фильтр</p>

        <FilterInput
          name="denomination"
          label="Наименование"
          placeholder="Наименование" />
        <FilterInput name="article" label="Артикул" placeholder="Артикул" />

        <div class="relative inline-block text-left">
          <Listbox v-model="selectedCities" multiple>
            <p class="text-[13px] py-2 font-semibold text-[#101828]">Населенный пункт</p>
            <ListboxButton class="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium  hover:bg-gray-50">
              <p class=" text-sm text-gray-400 font-normal">Населенный пункт</p>
            </ListboxButton>

            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 w-full shadow-lg max-h-36 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm bg-white">
                <ListboxOption v-for="item in filters.cities" :key="item.id" :value="item" as="template">
                  <li class="text-gray-900 cursor-pointer bg-blue-200 rounded hover:bg-blue-100 select-none  my-1 mx-1 py-2 pl-3 pr-9" :class="{ 'text-black bg-gray-50 ': selectedCities.some(city => city.id === item.id)}">
                    <span class="font-normal block truncate"> {{ item.title }}</span>
                  </li>
                </ListboxOption>
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
            <p class="text-[13px] py-2 font-semibold text-[#101828]">Поставщик</p>
            <ListboxButton class="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium  hover:bg-gray-50">
              <p class=" text-sm text-gray-400 font-normal">Поставщик</p>
            </ListboxButton>

            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 w-full shadow-lg max-h-36 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm bg-white">
                <ListboxOption v-for="item in filters.vendors" :key="item" :value="item" as="template">
                  <li class="text-gray-900 cursor-pointer bg-blue-200 rounded hover:bg-blue-100 select-none  my-1 mx-1 py-2 pl-3 pr-9" :class="{ 'text-black bg-gray-50 ': selectedVendors.includes(item) }">
                    <span class="font-normal block truncate">{{ item }}</span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>

        <div class="relative inline-block text-left">
          <Listbox v-model="selectedBrands" multiple >
            <p class="text-[13px] pb-2 font-semibold text-[#101828]">Бренд</p>
            <ListboxButton class="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
              <p class=" text-sm text-gray-400 font-normal">Бренд</p>
            </ListboxButton>
            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 w-full shadow-lg max-h-36 rounded-md py-1 bg-white text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <ListboxOption v-for="item in filters.brands" :key="item" :value="item" as="template">
                    <li class="text-gray-900 cursor-pointer bg-blue-200 rounded hover:bg-blue-100 select-none  my-1 mx-1 py-2 pl-3 pr-9" :class="{ 'text-black bg-gray-50 ': selectedBrands.includes(item) }">
                      <span class="font-normal block truncate" >{{ item }}</span>
                    </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </Listbox>
        </div>
  </div>

      <div class="w-full border-t border-[#CCD0D9] p-4 md:min-w-[305px] bg-[#F9FAFB]">
        <Button class="w-full text-[17px] font-semibold" type="submit">
          Применить фильтр
        </Button>
      </div>
    </form>
  </div>
</template>
