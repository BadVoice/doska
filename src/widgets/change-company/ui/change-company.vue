<script lang="ts" setup>
  import { companySelected } from '@/entities/company';
  import { type Company } from '@/shared/api/generated/Api';
  import { Button } from '@/shared/ui';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { ChevronLeft } from 'lucide-vue-next';
  import {
    $isChangeCompanyVisible,
    changeCompanyVisibleChanged,
    companiesQuery,
  } from '../model/change-company-model';

  const isSwitchCompanyVisible = useUnit($isChangeCompanyVisible);
  const changeCompanyVisible = useUnit(changeCompanyVisibleChanged);
  const handleCompanyChoosed = useUnit(companySelected);
  const { data: companies } = useUnit(companiesQuery);

  function handleSelected(company: Company) {
    handleCompanyChoosed(company);
    changeCompanyVisible(false);
  }
</script>

<template>
  <div
    v-if="isSwitchCompanyVisible"
    class="absolute inset-y-0 left-0 z-50 flex max-h-[100vh] w-full flex-col gap-y-6 overflow-hidden border-r border-[#D0D4DB] bg-white md:max-w-[356px]">
    <Button
      @click="changeCompanyVisible(false)"
      variant="ghost"
      class="h-fit w-full justify-start gap-x-2 rounded-none border-b border-[#D0D4DB] py-3">
      <ChevronLeft class="h-7 w-7" color="#0017FC" />
      <p class="text-[16px]">Сменить компанию</p>
    </Button>
    <ScrollArea class="h-[calc(100vh-28px)]">
      <div class="flex flex-col gap-y-4 px-4">
        <div
          v-for="company in companies"
          @click="handleSelected(company)"
          class="rounded-lg border-2 border-[#E0E7EF] bg-white px-3 py-1 transition-all duration-100 hover:border-[#0017FC] hover:bg-opacity-90">
          <p class="text-[15px]">{{ company.name }}</p>
          <p class="text-[14px] text-[#757575]">{{ company.email }}</p>
          <p class="text-[14px] text-[#757575]">{{ company.phone }}</p>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
