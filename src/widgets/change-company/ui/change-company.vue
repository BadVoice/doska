<script lang="ts" setup>
  import {
    $selectedCompany,
    companySelected,
    userSelected,
  } from '@/entities/company';
  import { type Company } from '@/shared/api/generated/Api';
  import { cn } from '@/shared/lib';
  import { Button } from '@/shared/ui';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { ChevronLeft } from 'lucide-vue-next';
  import { computed } from 'vue';
  import { getSelf } from '../../../entities/session/model/session-model';
  import {
    $isChangeCompanyVisible,
    changeCompanyVisibleChanged,
    companiesQuery,
  } from '../model/change-company-model';

  type companyOrUser = (
    | { id: null; name: string; email: string; phone: string }
    | Company
  ) & {
    user: boolean;
  };

  const isSwitchCompanyVisible = useUnit($isChangeCompanyVisible);
  const changeCompanyVisible = useUnit(changeCompanyVisibleChanged);
  const handleCompanyChoosed = useUnit(companySelected);
  const selectUser = useUnit(userSelected);
  const selectedCompany = useUnit($selectedCompany);

  const { data: companies } = useUnit(companiesQuery);
  const { data: currentUser } = useUnit(getSelf);

  // @ts-ignore
  const companiesWithUser = computed<companyOrUser[]>(() => [
    {
      id: null,
      user: true,
      name:
        currentUser.value?.first_name && currentUser.value?.last_name
          ? currentUser.value?.first_name + ' ' + currentUser.value?.last_name
          : undefined,
      email: currentUser.value?.email,
      phone: currentUser.value?.phone,
    },
    ...(companies.value?.forEach((c) => {
      const company: any = c;
      company.user = false;
      return company;
    }) ?? []),
  ]);

  function handleSelected(companyOrUser: companyOrUser) {
    if (companyOrUser?.user) {
      selectUser();
    } else {
      handleCompanyChoosed(companyOrUser as Company);
    }
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
          v-for="companyOrUser in companiesWithUser"
          @click="handleSelected(companyOrUser)"
          :class="
            cn(
              'rounded-lg border-2 border-[#E0E7EF] bg-white px-3 py-1 transition-all duration-100 hover:border-[#0017FC] hover:bg-opacity-90',
              (!selectedCompany || selectedCompany === companyOrUser?.id) &&
                'border-[#0017FC]',
            )
          ">
          <p class="text-[15px]" v-if="companyOrUser.user">Пользователь</p>
          <p class="text-[15px]" v-if="companyOrUser.name">
            {{ companyOrUser.name }}
          </p>
          <p class="text-[14px] text-[#757575]" v-if="companyOrUser.email">
            {{ companyOrUser.email }}
          </p>
          <p class="text-[14px] text-[#757575]" v-if="companyOrUser.phone">
            {{ companyOrUser.phone }}
          </p>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
