import { type DefineComponent } from 'vue';

export interface IButtonMobile {
    link: string;
    fullmatch?: boolean;
    icon: DefineComponent<{}, {}, any> | null;
}
