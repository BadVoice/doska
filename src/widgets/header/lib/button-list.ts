import { computed, type Ref } from 'vue';

export function getButtonList(visibleSearch: Ref<boolean>) {
  return computed(() => {
    if (visibleSearch.value) {
      return [
        {
          label: 'Объявления',
          link: '/search-history',
          active: false,
          status: -2,
        },
        {
          label: 'Заявки',
          link: '/',
          active: false,
          status: -1,
        },
      ];
    } else {
      return [
        {
          label: 'Мои заявки',
          link: '/',
          active: false,
          status: -1,
        },
        {
          label: 'Созданные',
          link: '/',
          active: false,
          status: 0,
        },
        {
          label: 'Опубликованные',
          link: '/',
          active: false,
          status: 1,
        },
        {
          label: 'Исполненные',
          link: '/',
          active: false,
          status: 2,
        },
        {
          label: 'Архивированные',
          link: '/',
          active: false,
          status: 3,
        },
      ];
    }
  });
}
