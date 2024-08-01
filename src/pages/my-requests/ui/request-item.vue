<script lang="ts" setup>
  import { $selectedAdvertisementId } from '@/entities/advertisement';
  import type { BidWithName } from '@/entities/requests';
  import { cn } from '@/shared/lib';
  import { Button, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
  import { useUnit } from 'effector-vue/composition';
  import { PopoverClose } from 'radix-vue';
  import { ref } from 'vue';
  import { historyClickedBid } from '../model/history-model';
  import {
    archiveRequestClicked,
    cancelStatusClicked,
    editRequestSelected,
    publicationClicked,
    requestClicked,
  } from '../model/my-requests-model';
  import { requestViewModeChanged } from '../model/view-mode';

  defineProps<{
    status: { color: string; text: string }[];
    item: BidWithName;
    showDate?: boolean;
    statusHistory?: { changed_at: string; status: number };
  }>();

  function renderFile(file: File) {
    return URL.createObjectURL(file);
  }

  const handleRequestClicked = useUnit(requestClicked);
  const handleEditRequest = useUnit(editRequestSelected);
  const handleArchiveRequest = useUnit(archiveRequestClicked);
  const handlePublicationClicked = useUnit(publicationClicked);

  const selectedRequest = useUnit($selectedAdvertisementId);

  const changeViewMode = useUnit(requestViewModeChanged);
  const showHistory = useUnit(historyClickedBid);

  const popoverOpened = ref(false);

  const handleClick = (item: BidWithName) => {
    if (!item) return null;

    handleRequestClicked(item);
  };
  const handleClickOnChange = (item: BidWithName) => {
    handleEditRequest(item);
    changeViewMode('selectBrand');
  };
</script>

<template>
  <div
    @click="handleClick(item)"
    :class="
      cn(
        'flex flex-col items-start justify-between gap-y-1 rounded-lg border-2 bg-white p-4 pr-5 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10',
        selectedRequest === item.id?.toString() &&
          'border-[#0017FC] bg-[#1778EA] bg-opacity-10',
      )
    "
    class="px-4 py-3 transition-all duration-75 hover:border-[#0017FC]">
    <div class="flex w-full flex-col gap-y-1">
      <div class="flex w-full justify-between">
        <p class="text-sm font-normal text-[#101828]">{{ item.name }}</p>

        <Popover
          v-if="
            (showDate && item.status === statusHistory?.status) || !showDate
          "
          @update:open="(value) => (popoverOpened = value)">
          <PopoverTrigger @click.stop>
            <span
              :class="
                cn(
                  'cursor-pointer select-none text-3xl leading-[0px] text-[#858FA3] transition-all duration-75 hover:text-[#0017FC]',
                  popoverOpened && 'text-[#0017FC]',
                )
              "
              >...</span
            >
          </PopoverTrigger>
          <PopoverContent
            class="flex h-fit w-[150px] flex-col justify-center overflow-hidden rounded-[10px] p-0">
            <PopoverClose class="flex flex-col gap-y-0">
              <Button
                v-if="item.status === 0"
                @click="handlePublicationClicked(item)"
                variant="ghost"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Опубликовать</p>
              </Button>
              <!--<Button
                v-if="item.status === 1"
                variant="ghost"
                @click="handleCompleteRequest(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Исполнить</p>
              </Button> -->

              <Button
                v-if="item.status !== 2"
                variant="ghost"
                @click="handleClickOnChange(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Редактировать</p>
              </Button>
              <!--<Button
                v-if="item.status !== 2"
                variant="ghost"
                @click="deleteRequestClicked(item.id ?? 0)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Удалить заявку</p>
              </Button> -->
              <Button
                @click="showHistory(item)"
                variant="ghost"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">История</p>
              </Button>
              <Button
                v-if="item.status !== 3 && item.status !== 2"
                variant="ghost"
                @click="handleArchiveRequest(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Архивировать</p>
              </Button>
              <Button
                v-if="item.status !== 0 && item.status !== 1"
                variant="ghost"
                @click="cancelStatusClicked(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Отменить</p>
              </Button>
              <Button
                v-if="item.status === 1"
                variant="ghost"
                @click="cancelStatusClicked(item)"
                class="flex h-full w-full px-4 py-2 text-start hover:bg-[#F9FAFB]">
                <p class="w-full text-[14px] font-semibold">Не опубликовано</p>
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
      <div class="flex w-full flex-col items-start justify-between gap-y-1">
        <div class="flex w-full flex-row justify-between">
          <div class="flex w-full justify-between gap-x-2 pr-4">
            <p class="text-xs font-normal text-[#858FA3]" v-if="item.article">
              {{ item.article }}
            </p>
            <p class="text-xs font-normal text-[#858FA3]" v-else>Не указано</p>
            <p class="text-xs font-normal text-[#858FA3]" v-if="item.brandName">
              {{ item.brandName }}
            </p>
          </div>
          <div class="flex gap-x-1">
            <p
              class="whitespace-nowrap text-xs font-normal text-[#101828]"
              v-if="item.amount">
              {{ item.amount }}
            </p>
            <p
              class="whitespace-nowrap text-xs font-normal text-[#101828]"
              v-else>
              Не указано
            </p>
            <p
              class="whitespace-nowrap text-xs font-normal text-[#101828]"
              v-if="item.amount">
              шт
            </p>
          </div>
        </div>

        <div class="flex flex-row gap-x-2">
          <div>
            <p
              class="min-w-[50px] text-xs font-normal text-[#858FA3]"
              v-if="item.categoryName">
              {{ item.categoryName }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-x-2" v-if="item.image">
      <img
        :src="renderFile(item.image)"
        alt="attachment"
        class="h-10 w-10 object-cover" />
    </div>

    <div v-if="showDate" class="flex w-full justify-between">
      <div class="flex items-center gap-x-1">
        <span
          :style="{
            backgroundColor:
              status[statusHistory?.status ?? item.status ?? 0].color,
          }"
          class="mt-0.5 h-2 w-[9px] rounded-full" />
        <p
          class="text-sm"
          :style="{
            color: status[statusHistory?.status ?? item.status ?? 0].color,
          }">
          {{ status[statusHistory?.status ?? item.status ?? 0].text }}
        </p>
      </div>
      <p class="text-[14px] font-normal text-[#667085]">
        {{
          new Date(
            Date.parse(
              statusHistory?.changed_at.toString() ?? item.created_at!,
            ),
          )
            .toLocaleString('ru-RU', {
              timeStyle: 'short',
              dateStyle: 'short',
            })
            .split(', ')
            .reverse()
            .join(' ')
        }}
      </p>
    </div>
    <div v-else class="flex items-center gap-x-1">
      <span
        :style="{
          backgroundColor:
            status[statusHistory?.status ?? item.status ?? 0].color,
        }"
        class="mt-0.5 h-2 w-[9px] rounded-full" />
      <p
        class="text-sm"
        :style="{
          color: status[statusHistory?.status ?? item.status ?? 0].color,
        }">
        {{ status[statusHistory?.status ?? item.status ?? 0].text }}
      </p>
    </div>
  </div>
</template>
