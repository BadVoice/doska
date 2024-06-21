/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SiteInfo {
  recaptcha_site_key?: string;
}

export interface PostUser {
  username: string;
  recaptcha?: string;
}

export interface VerifyUser {
  username: string;
  code: number;
  recaptcha?: string;
}

export interface User {
  username?: string;
  recaptcha?: string;
  /** @format email */
  email?: string;
  first_name?: string;
  last_name?: string;
  /**
   * @format date
   * @example "2022-07-01"
   */
  date_of_birth?: string;
  phone?: string;
}

export interface AuthUserResponse {
  message?: string;
}

export interface VerifyUserResponse {
  success?: string;
  refresh?: string;
  access?: string;
}

export interface Profile {
  username: string;
  /** user_id */
  user?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  date_joined?: string;
  phone?: string;
}

export type Profiles = Profile[];

export interface UserAuth {
  /** email or phone */
  username: string;
  password: string;
  recaptcha?: string;
}

export interface UserAuthRefresh {
  refresh: string;
}

export interface UserAuthVerify {
  token: string;
}

export interface Token {
  refresh?: string;
  access?: string;
}

export interface AccessToken {
  access?: string;
}

export interface Company {
  id?: number;
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  /**
   * dictionary:
   *   * 0 Не определено
   *   * 1 ООО
   *   * 2 ИП
   *   * 3 ПАО
   *   * 4 АО
   * @default 0
   */
  legal_form?: 0 | 1 | 2 | 3 | 4;
  /**
   * dictionary:
   *   * 0 НДС
   *   * 1 Без НДС
   * @default 0
   */
  tax_system?: 0 | 1;
}

export type Companies = Company[];

export interface Category {
  id?: number;
  name?: string;
}

export type Categories = Category[];

export interface Brand {
  id?: number;
  name?: string;
}

export type Brands = Brand[];

export interface Destination {
  id?: number;
  name?: string;
}

export type Destinations = Destination[];

export interface Nomenclature {
  id?: number;
  name?: string;
  article?: string;
  /** nomenclature_id */
  destination?: number;
}

export type Nomenclatures = Nomenclature[];

export interface Bid {
  id?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  /** @format binary */
  image?: File | null;
  /**
   * dictionary:
   *   * 0 Создана
   *   * 1 Опубликована
   *   * 2 Исполнена
   *   * 3 Архивирована
   * @default 0
   */
  status?: 0 | 1 | 2 | 3;
  name: string;
  article?: string;
  amount: number;
  delivery_time?: number;
  description?: string;
  /** company_id */
  company?: number;
  /** category_id */
  category?: number;
  /** brand_id */
  brand?: number;
  /** destination_id */
  destinations?: number[];
}

export type Bids = Bid[];

export interface BidPage {
  count?: number;
  next?: string;
  previous?: string;
  results?: Bid[];
}

export interface Offer {
  id?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  /** @format binary */
  image?: File | null;
  /**
   * dictionary:
   *   * 0 Создано
   *   * 1 Опубликовано
   *   * 2 Исполнено
   *   * 3 Архивировано
   * @default 0
   */
  status?: 0 | 1 | 2 | 3;
  name: string;
  article?: string;
  price: number;
  amount: number;
  delivery_time?: number;
  description?: string;
  /** company_id */
  company?: number;
  /** category_id */
  category?: number;
  /** brand_id */
  brand?: number;
  /** city_id */
  city?: number;
  /** destination_id */
  destinations?: number[];
}

export type Offers = Offer[];

export interface Confirmation {
  id?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  name: string;
  price?: number;
  amount?: number;
  delivery_time?: number;
  /** company_id */
  company?: number;
  /** user_id */
  user?: number;
  /** profile_id */
  profile?: number;
  /** bid_id */
  bid?: number;
  /** offer_id */
  offer?: number;
}

export type Confirmations = Confirmation[];

export interface Order {
  id?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  /**
   * dictionary:
   *   * 0 Заказан
   *   * 1 Исполнен
   * @default 0
   */
  status?: 0 | 1;
  name: string;
  amount: number;
  price: number;
  delivery_time?: number;
  description?: string;
  /** company_id */
  company?: number;
  /** bid_id */
  bid?: number;
  /** offer_id */
  offer?: number;
  /** confirmation_id */
  confirmation: number;
}

export type Orders = Order[];

export interface OrderReturn {
  id?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  /**
   * dictionary:
   *   * 0 Возврат
   *   * 1 Возвращен
   * @default 0
   */
  status?: 0 | 1;
  amount: number;
  description?: string;
  /** order_id */
  order: number;
}

export type OrderReturns = OrderReturn[];

export interface Interest {
  id?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  /** user_id */
  related_user?: number;
  /** brand_id */
  brand?: number;
  /** city_id */
  city?: number;
  amount?: number[];
  delivery_time?: number[];
  article?: string;
  name?: string;
  description?: string;
}

export type Interests = Interest[];

export interface QwepInterest {
  id?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  /** user_id */
  related_user?: number;
  vendor?: string;
  brand?: string;
  /** city_id */
  city?: number;
  amount?: number[];
  delivery_time?: number[];
  article?: string;
  name?: string;
  description?: string;
}

export type QwepInterests = QwepInterest[];

export interface PutAccount {
  id?: number;
  title?: string;
  is_active?: boolean;
}

export interface Account {
  id?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  account_id?: number;
  vendor_id?: string;
  branch_id?: string;
  title?: string;
  login?: string;
  password?: string;
  is_active?: boolean;
}

export type Accounts = Account[];

export interface PreSearchRequest {
  search: string;
  clear_cache?: boolean;
}

export interface PreSearchResponse {
  id?: string;
  article?: string;
  brand?: string;
  part_name?: string;
}

export type PreSearchResponses = PreSearchResponse[];

export interface PriceFilter {
  from?: number;
  to?: number;
}

export interface DeliveryFilter {
  from?: number;
  to?: number;
}

export interface AmountFilter {
  from?: number;
  to?: number;
}

export interface Filters {
  name?: string;
  article?: string;
  price?: PriceFilter;
  delivery?: DeliveryFilter;
  amount?: AmountFilter;
}

export interface ExcludeFilters {
  brand?: string[];
  vendor?: string[];
  city_id?: number[];
}

export interface SearchRequest {
  search: string;
  brand: string;
  clear_cache?: boolean;
  page_size?: number;
  page?: number;
  filters?: Filters;
  exclude?: ExcludeFilters;
}

export interface Item {
  itemId?: string;
  accountId?: number;
  fromClarification?: string;
  brand?: string;
  highlightBrand?: string;
  article?: string;
  originalArticle?: string;
  title?: string;
  photo?: string;
  notes?: string;
  city?: string;
  subway?: string;
  warehouse?: string;
  origWarehouse?: string;
  delivery?: string;
  deliveryStart?: string;
  deliveryEnd?: string;
  status?: string;
  minQuantity?: string;
  price?: ItemPrice;
  quantity?: ItemQuantity;
  qwepCross?: string;
  info?: ItemInfo;
  vendorTitle?: string;
  parsedDelivery?: string;
}

export interface SearchResponse {
  page?: number;
  pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
  items_count?: number;
  search_id?: string;
  items?: Item[];
  filters?: SearchResponseFilters;
}

export interface Vendor {
  id?: string;
  title?: string;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  is_active?: boolean;
  qwep_vendors?: VendorQwepVendors[];
}

export type Vendors = Vendor[];

export interface Response {
  success?: boolean;
}

export interface Error {
  detail: string;
}

export interface InlineResponse204 {
  success?: boolean;
}

export interface NomenclaturesBody {
  company_id?: number;
}

export interface CartBody {
  account_id: number;
  cart_id: string;
  cart_item_id: string;
  quantity: number;
}

export interface CartBody1 {
  search_id: string;
  item_id: string;
  quantity: number;
}

export interface ItemPrice {
  value?: string;
  currency?: string;
  formatted?: string;
}

export interface ItemQuantity {
  sign?: string;
  value?: string;
  unit?: string;
  multiplicity?: string;
  formatted?: string;
}

export interface ItemInfo {
  supplyPercent?: string;
  isRefundAvailable?: string;
  refundDescription?: string;
  isDealerWarehouse?: string;
  isUsed?: string;
  isMarkdown?: string;
  vendorRating?: string;
}

export interface SearchResponseFiltersCities {
  id?: number;
  title?: string;
}

export interface SearchResponseFilters {
  brands?: string[];
  vendors?: string[];
  cities?: SearchResponseFiltersCities[];
}

export interface VendorQwepVendors {
  id?: string;
  title?: string;
  qwep_id?: string;
  display_name?: string;
  url?: string;
  basket?: string;
  branches?: string;
  single_session?: boolean;
  checkout?: boolean;
  is_active?: boolean;
  vendor?: number;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL:
        axiosConfig.baseURL ||
        'https://virtserver.swaggerhub.com/riderufa/qrq_core/1.0.0',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === 'object'
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== 'string'
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { 'Content-Type': type }
          : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title QRQ API
 * @version 1.0.0
 * @baseUrl https://virtserver.swaggerhub.com/riderufa/qrq_core/1.0.0
 * @contact <garrigilmanov@gmail.com>
 *
 * QRQ core API
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  token = {
    /**
     * No description
     *
     * @tags Auth
     * @name RefreshCreate
     * @summary метод обновления токена
     * @request POST:/token/refresh
     */
    refreshCreate: (data: UserAuthRefresh, params: RequestParams = {}) =>
      this.request<AccessToken, Error>({
        path: `/token/refresh`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name VerifyCreate
     * @summary метод проверки токена
     * @request POST:/token/verify
     */
    verifyCreate: (data: UserAuthVerify, params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/token/verify`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  siteInfo = {
    /**
     * No description
     *
     * @tags SiteInfo
     * @name GetSiteInfo
     * @summary метод получения информации о сайте
     * @request GET:/site_info
     */
    getSiteInfo: (params: RequestParams = {}) =>
      this.request<SiteInfo, Error>({
        path: `/site_info`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name GetUser
     * @summary метод получения информации о пользователе
     * @request GET:/user
     * @secure
     */
    getUser: (params: RequestParams = {}) =>
      this.request<User, Error>({
        path: `/user`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UpdateUser
     * @summary метод изменения пользователя
     * @request PUT:/user
     * @secure
     */
    updateUser: (data: User, params: RequestParams = {}) =>
      this.request<User, Error>({
        path: `/user`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name CreateAuthUser
     * @summary метод создания или аутентификации пользователя
     * @request POST:/user
     */
    createAuthUser: (data: PostUser, params: RequestParams = {}) =>
      this.request<AuthUserResponse, Error>({
        path: `/user`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  userVerify = {
    /**
     * @description токен опционально
     *
     * @tags User
     * @name VerifyUser
     * @summary метод верификации пользователя
     * @request POST:/user_verify
     * @secure
     */
    verifyUser: (data: VerifyUser, params: RequestParams = {}) =>
      this.request<VerifyUserResponse, Error>({
        path: `/user_verify`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  profiles = {
    /**
     * No description
     *
     * @tags Profiles
     * @name GetProfiles
     * @summary метод получения списка профилей
     * @request GET:/profiles/
     * @secure
     */
    getProfiles: (params: RequestParams = {}) =>
      this.request<Profiles, Error>({
        path: `/profiles/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name CreateProfile
     * @summary метод создания профиля
     * @request POST:/profiles/
     * @secure
     */
    createProfile: (data: Profile, params: RequestParams = {}) =>
      this.request<Profile, Error>({
        path: `/profiles/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name GetProfile
     * @summary метод получения профиля
     * @request GET:/profiles/{profile_id}
     * @secure
     */
    getProfile: (profileId: number, params: RequestParams = {}) =>
      this.request<Profile, Error>({
        path: `/profiles/${profileId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name UpdateProfile
     * @summary метод изменения профиля
     * @request PUT:/profiles/{profile_id}
     * @secure
     */
    updateProfile: (
      profileId: number,
      data: Profile,
      params: RequestParams = {},
    ) =>
      this.request<Profile, Error>({
        path: `/profiles/${profileId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name DeleteProfile
     * @summary метод удаления профиля
     * @request DELETE:/profiles/{profile_id}
     * @secure
     */
    deleteProfile: (profileId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/profiles/${profileId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  companies = {
    /**
     * No description
     *
     * @tags Companies
     * @name GetUserCompanies
     * @summary метод получения списка организаций пользователя
     * @request GET:/companies/
     * @secure
     */
    getUserCompanies: (params: RequestParams = {}) =>
      this.request<Companies, Error>({
        path: `/companies/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Companies
     * @name CreateUserCompany
     * @summary метод создания организации пользователя
     * @request POST:/companies/
     * @secure
     */
    createUserCompany: (data: Company, params: RequestParams = {}) =>
      this.request<Company, Error>({
        path: `/companies/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Companies
     * @name GetUserCompany
     * @summary метод получения организации пользователя
     * @request GET:/companies/{company_id}
     * @secure
     */
    getUserCompany: (companyId: number, params: RequestParams = {}) =>
      this.request<Company, Error>({
        path: `/companies/${companyId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Companies
     * @name UpdateUserCompany
     * @summary метод изменения организации пользователя
     * @request PUT:/companies/{company_id}
     * @secure
     */
    updateUserCompany: (
      companyId: number,
      data: Company,
      params: RequestParams = {},
    ) =>
      this.request<Company, Error>({
        path: `/companies/${companyId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Companies
     * @name DeleteUserCompany
     * @summary метод удаления организации пользователя
     * @request DELETE:/companies/{company_id}
     * @secure
     */
    deleteUserCompany: (companyId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/companies/${companyId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  categories = {
    /**
     * No description
     *
     * @tags Categories
     * @name GetCategories
     * @summary метод получения списка категорий
     * @request GET:/categories/
     * @secure
     */
    getCategories: (params: RequestParams = {}) =>
      this.request<Categories, Error>({
        path: `/categories/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name CreateCategory
     * @summary метод создания категории
     * @request POST:/categories/
     * @secure
     */
    createCategory: (data: Category, params: RequestParams = {}) =>
      this.request<Category, Error>({
        path: `/categories/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name GetCategory
     * @summary метод получения категории
     * @request GET:/categories/{category_id}
     * @secure
     */
    getCategory: (categoryId: number, params: RequestParams = {}) =>
      this.request<Category, Error>({
        path: `/categories/${categoryId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name UpdateCategory
     * @summary метод изменения категории
     * @request PUT:/categories/{category_id}
     * @secure
     */
    updateCategory: (
      categoryId: number,
      data: Category,
      params: RequestParams = {},
    ) =>
      this.request<Category, Error>({
        path: `/categories/${categoryId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name DeleteCategory
     * @summary метод удаления категории
     * @request DELETE:/categories/{category_id}
     * @secure
     */
    deleteCategory: (categoryId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/categories/${categoryId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  brands = {
    /**
     * No description
     *
     * @tags Brands
     * @name GetBrands
     * @summary метод получения списка брендов
     * @request GET:/brands/
     * @secure
     */
    getBrands: (params: RequestParams = {}) =>
      this.request<Brands, Error>({
        path: `/brands/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Brands
     * @name CreateBrand
     * @summary метод создания бренда
     * @request POST:/brands/
     * @secure
     */
    createBrand: (data: Brand, params: RequestParams = {}) =>
      this.request<Brand, Error>({
        path: `/brands/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Brands
     * @name GetBrand
     * @summary метод получения бренда
     * @request GET:/brands/{brand_id}
     * @secure
     */
    getBrand: (brandId: number, params: RequestParams = {}) =>
      this.request<Brand, Error>({
        path: `/brands/${brandId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Brands
     * @name UpdateBrand
     * @summary метод изменения бренда
     * @request PUT:/brands/{brand_id}
     * @secure
     */
    updateBrand: (brandId: number, data: Brand, params: RequestParams = {}) =>
      this.request<Brand, Error>({
        path: `/brands/${brandId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Brands
     * @name DeleteBrand
     * @summary метод удаления бренда
     * @request DELETE:/brands/{brand_id}
     * @secure
     */
    deleteBrand: (brandId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/brands/${brandId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  destinations = {
    /**
     * No description
     *
     * @tags Destinations
     * @name GetDestinations
     * @summary метод получения списка назначений
     * @request GET:/destinations/
     * @secure
     */
    getDestinations: (params: RequestParams = {}) =>
      this.request<Destinations, Error>({
        path: `/destinations/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Destinations
     * @name CreateDestination
     * @summary метод создания назначения
     * @request POST:/destinations/
     * @secure
     */
    createDestination: (data: Destination, params: RequestParams = {}) =>
      this.request<Destination, Error>({
        path: `/destinations/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Destinations
     * @name GetDestination
     * @summary метод получения назначения
     * @request GET:/destinations/{destination_id}
     * @secure
     */
    getDestination: (destinationId: number, params: RequestParams = {}) =>
      this.request<Destination, Error>({
        path: `/destinations/${destinationId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Destinations
     * @name UpdateDestination
     * @summary метод изменения назначения
     * @request PUT:/destinations/{destination_id}
     * @secure
     */
    updateDestination: (
      destinationId: number,
      data: Destination,
      params: RequestParams = {},
    ) =>
      this.request<Destination, Error>({
        path: `/destinations/${destinationId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Destinations
     * @name DeleteDestination
     * @summary метод удаления назначения
     * @request DELETE:/destinations/{destination_id}
     * @secure
     */
    deleteDestination: (destinationId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/destinations/${destinationId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  nomenclatures = {
    /**
     * No description
     *
     * @tags Nomenclatures
     * @name GetNomenclatures
     * @summary метод получения списка номенклатур
     * @request GET:/nomenclatures/
     * @secure
     */
    getNomenclatures: (
      query?: {
        /** поиск по наименованию, артикулу */
        search?: string;
      },
      data?: NomenclaturesBody,
      params: RequestParams = {},
    ) =>
      this.request<Nomenclatures, Error>({
        path: `/nomenclatures/`,
        method: 'GET',
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nomenclatures
     * @name CreateNomenclature
     * @summary метод создания номенклатуры
     * @request POST:/nomenclatures/
     * @secure
     */
    createNomenclature: (data: Nomenclature, params: RequestParams = {}) =>
      this.request<Nomenclature, Error>({
        path: `/nomenclatures/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nomenclatures
     * @name GetNomenclature
     * @summary метод получения номенклатуры
     * @request GET:/nomenclatures/{nomenclature_id}
     * @secure
     */
    getNomenclature: (nomenclatureId: number, params: RequestParams = {}) =>
      this.request<Nomenclature, Error>({
        path: `/nomenclatures/${nomenclatureId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nomenclatures
     * @name UpdateNomenclature
     * @summary метод изменения номенклатуры
     * @request PUT:/nomenclatures/{nomenclature_id}
     * @secure
     */
    updateNomenclature: (
      nomenclatureId: number,
      data: Nomenclature,
      params: RequestParams = {},
    ) =>
      this.request<Nomenclature, Error>({
        path: `/nomenclatures/${nomenclatureId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nomenclatures
     * @name DeleteNomenclature
     * @summary метод удаления номенклатуры
     * @request DELETE:/nomenclatures/{nomenclature_id}
     * @secure
     */
    deleteNomenclature: (nomenclatureId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/nomenclatures/${nomenclatureId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  bids = {
    /**
     * No description
     *
     * @tags Bids
     * @name GetBids
     * @summary метод получения списка заявок
     * @request GET:/bids/
     * @secure
     */
    getBids: (
      query?: {
        /** поиск по наименованию, описанию */
        search?: string;
        /** фильтр по артикулу */
        article?: string;
        /** фильтр по количеству */
        amount?: number;
        /** список destination_id */
        destinations?: number[];
      },
      params: RequestParams & { page: number } = { page: 1 },
    ) =>
      this.request<BidPage, Error>({
        path: `/bids/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bids
     * @name CreateBid
     * @summary метод создания заявки
     * @request POST:/bids/
     * @secure
     */
    createBid: (data: Bid, params: RequestParams = {}) =>
      this.request<Bid, Error>({
        path: `/bids/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bids
     * @name GetBid
     * @summary метод получения заявки
     * @request GET:/bids/{bid_id}
     * @secure
     */
    getBid: (bidId: number, params: RequestParams = {}) =>
      this.request<Bid, Error>({
        path: `/bids/${bidId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bids
     * @name UpdateBid
     * @summary метод изменения заявки
     * @request PUT:/bids/{bid_id}
     * @secure
     */
    updateBid: (bidId: number, data: Bid, params: RequestParams = {}) =>
      this.request<Bid, Error>({
        path: `/bids/${bidId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bids
     * @name DeleteBid
     * @summary метод удаления заявки
     * @request DELETE:/bids/{bid_id}
     * @secure
     */
    deleteBid: (bidId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/bids/${bidId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  offers = {
    /**
     * No description
     *
     * @tags Offers
     * @name GetOffers
     * @summary метод получения списка предложений
     * @request GET:/offers/
     * @secure
     */
    getOffers: (
      query?: {
        /** поиск по наименованию, описанию */
        search?: string;
        /** фильтр по артикулу */
        article?: string;
        /** фильтр по количеству */
        amount?: number;
        /** список destination_id */
        destinations?: number[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Offers, Error>({
        path: `/offers/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Offers
     * @name CreateOffer
     * @summary метод создания предложения
     * @request POST:/offers/
     * @secure
     */
    createOffer: (data: Offer, params: RequestParams = {}) =>
      this.request<Offer, Error>({
        path: `/offers/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Offers
     * @name GetOffer
     * @summary метод получения предложения
     * @request GET:/offers/{offer_id}
     * @secure
     */
    getOffer: (offerId: number, params: RequestParams = {}) =>
      this.request<Offer, Error>({
        path: `/offers/${offerId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Offers
     * @name UpdateOffer
     * @summary метод изменения предложения
     * @request PUT:/offers/{offer_id}
     * @secure
     */
    updateOffer: (offerId: number, data: Offer, params: RequestParams = {}) =>
      this.request<Offer, Error>({
        path: `/offers/${offerId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Offers
     * @name DeleteOffer
     * @summary метод удаления предложения
     * @request DELETE:/offers/{offer_id}
     * @secure
     */
    deleteOffer: (offerId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/offers/${offerId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  confirmations = {
    /**
     * No description
     *
     * @tags Confirmations
     * @name GetConfirmations
     * @summary метод получения списка подтверждений
     * @request GET:/confirmations/
     * @secure
     */
    getConfirmations: (params: RequestParams = {}) =>
      this.request<Confirmations, Error>({
        path: `/confirmations/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Confirmations
     * @name CreateConfirmation
     * @summary метод создания подтверждения
     * @request POST:/confirmations/
     * @secure
     */
    createConfirmation: (data: Confirmation, params: RequestParams = {}) =>
      this.request<Confirmation, Error>({
        path: `/confirmations/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Confirmations
     * @name GetConfirmation
     * @summary метод получения подтверждения
     * @request GET:/confirmations/{confirmation_id}
     * @secure
     */
    getConfirmation: (confirmationId: number, params: RequestParams = {}) =>
      this.request<Confirmation, Error>({
        path: `/confirmations/${confirmationId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Confirmations
     * @name UpdateConfirmation
     * @summary метод изменения подтверждения
     * @request PUT:/confirmations/{confirmation_id}
     * @secure
     */
    updateConfirmation: (
      confirmationId: number,
      data: Confirmation,
      params: RequestParams = {},
    ) =>
      this.request<Confirmation, Error>({
        path: `/confirmations/${confirmationId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Confirmations
     * @name DeleteConfirmation
     * @summary метод удаления подтверждения
     * @request DELETE:/confirmations/{confirmation_id}
     * @secure
     */
    deleteConfirmation: (confirmationId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/confirmations/${confirmationId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  orders = {
    /**
     * No description
     *
     * @tags Orders
     * @name GetOrders
     * @summary метод получения списка заказов
     * @request GET:/orders/
     * @secure
     */
    getOrders: (params: RequestParams = {}) =>
      this.request<Orders, Error>({
        path: `/orders/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name CreateOrder
     * @summary метод создания заказа
     * @request POST:/orders/
     * @secure
     */
    createOrder: (data: Order, params: RequestParams = {}) =>
      this.request<Order, Error>({
        path: `/orders/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name GetOrder
     * @summary метод получения заказа
     * @request GET:/orders/{order_id}
     * @secure
     */
    getOrder: (orderId: number, params: RequestParams = {}) =>
      this.request<Order, Error>({
        path: `/orders/${orderId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name UpdateOrder
     * @summary метод изменения заказа
     * @request PUT:/orders/{order_id}
     * @secure
     */
    updateOrder: (orderId: number, data: Order, params: RequestParams = {}) =>
      this.request<Order, Error>({
        path: `/orders/${orderId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name DeleteOrder
     * @summary метод удаления заказа
     * @request DELETE:/orders/{order_id}
     * @secure
     */
    deleteOrder: (orderId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/orders/${orderId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  orderReturns = {
    /**
     * No description
     *
     * @tags OrderReturns
     * @name GetOrderReturns
     * @summary метод получения списка возвратов
     * @request GET:/order_returns/
     * @secure
     */
    getOrderReturns: (params: RequestParams = {}) =>
      this.request<OrderReturns, Error>({
        path: `/order_returns/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderReturns
     * @name CreateOrderReturn
     * @summary метод создания возврата
     * @request POST:/order_returns/
     * @secure
     */
    createOrderReturn: (data: OrderReturn, params: RequestParams = {}) =>
      this.request<OrderReturn, Error>({
        path: `/order_returns/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderReturns
     * @name GetOrderReturn
     * @summary метод получения возврата
     * @request GET:/order_returns/{order_return_id}
     * @secure
     */
    getOrderReturn: (orderReturnId: number, params: RequestParams = {}) =>
      this.request<OrderReturn, Error>({
        path: `/order_returns/${orderReturnId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderReturns
     * @name UpdateOrderReturn
     * @summary метод изменения возврата
     * @request PUT:/order_returns/{order_return_id}
     * @secure
     */
    updateOrderReturn: (
      orderReturnId: number,
      data: OrderReturn,
      params: RequestParams = {},
    ) =>
      this.request<OrderReturn, Error>({
        path: `/order_returns/${orderReturnId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderReturns
     * @name DeleteOrderReturn
     * @summary метод удаления возврата
     * @request DELETE:/order_returns/{order_return_id}
     * @secure
     */
    deleteOrderReturn: (orderReturnId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/order_returns/${orderReturnId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  interests = {
    /**
     * No description
     *
     * @tags Interests
     * @name GetInterests
     * @summary метод получения списка интересов
     * @request GET:/interests/
     * @secure
     */
    getInterests: (params: RequestParams = {}) =>
      this.request<Interests, Error>({
        path: `/interests/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name CreateInterest
     * @summary метод создания интереса
     * @request POST:/interests/
     * @secure
     */
    createInterest: (data: Interest, params: RequestParams = {}) =>
      this.request<Interest, Error>({
        path: `/interests/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name GetInterest
     * @summary метод получения интереса
     * @request GET:/interests/{interest_id}
     * @secure
     */
    getInterest: (interestId: number, params: RequestParams = {}) =>
      this.request<Interest, Error>({
        path: `/interests/${interestId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name UpdateInterest
     * @summary метод изменения интереса
     * @request PUT:/interests/{interest_id}
     * @secure
     */
    updateInterest: (
      interestId: number,
      data: Interest,
      params: RequestParams = {},
    ) =>
      this.request<Interest, Error>({
        path: `/interests/${interestId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Interests
     * @name DeleteInterest
     * @summary метод удаления интереса
     * @request DELETE:/interests/{interest_id}
     * @secure
     */
    deleteInterest: (interestId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/interests/${interestId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  preSearch = {
    /**
     * No description
     *
     * @tags QWEP
     * @name GetPreSearch
     * @summary предварительный поиск
     * @request POST:/pre_search
     * @secure
     */
    getPreSearch: (data: PreSearchRequest, params: RequestParams = {}) =>
      this.request<PreSearchResponses, Error>({
        path: `/pre_search`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  search = {
    /**
     * No description
     *
     * @tags QWEP
     * @name GetSearch
     * @summary поиск
     * @request POST:/search
     * @secure
     */
    getSearch: (data: SearchRequest, params: RequestParams = {}) =>
      this.request<SearchResponse, Error>({
        path: `/search`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  vendors = {
    /**
     * No description
     *
     * @tags QWEP
     * @name GetVendors
     * @summary метод получения списка поставщиков
     * @request POST:/vendors
     * @secure
     */
    getVendors: (
      query?: {
        /** поиск по наименованию */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Vendors, Error>({
        path: `/vendors`,
        method: 'POST',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  cart = {
    /**
     * No description
     *
     * @tags QWEP
     * @name GetCart
     * @summary метод получения корзины
     * @request GET:/cart
     * @secure
     */
    getCart: (params: RequestParams = {}) =>
      this.request<Vendors, Error>({
        path: `/cart`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name UpdateCartItem
     * @summary метод изменения позиции корзины
     * @request PUT:/cart
     * @secure
     */
    updateCartItem: (data: CartBody, params: RequestParams = {}) =>
      this.request<Response, Error>({
        path: `/cart`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name CreateCartItem
     * @summary метод создания позиции корзины
     * @request POST:/cart
     * @secure
     */
    createCartItem: (data: CartBody1, params: RequestParams = {}) =>
      this.request<Response, Error>({
        path: `/cart`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name DeleteCartItem
     * @summary метод удаления позиции корзины
     * @request DELETE:/cart
     * @secure
     */
    deleteCartItem: (params: RequestParams = {}) =>
      this.request<Response, Error>({
        path: `/cart`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  qwepInterests = {
    /**
     * No description
     *
     * @tags QWEP
     * @name GetQwepInterests
     * @summary метод получения списка интересов
     * @request GET:/qwep_interests/
     * @secure
     */
    getQwepInterests: (params: RequestParams = {}) =>
      this.request<QwepInterests, Error>({
        path: `/qwep_interests/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name CreateQwepInterest
     * @summary метод создания интереса
     * @request POST:/qwep_interests/
     * @secure
     */
    createQwepInterest: (data: QwepInterest, params: RequestParams = {}) =>
      this.request<QwepInterest, Error>({
        path: `/qwep_interests/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name GetQwepInterest
     * @summary метод получения интереса
     * @request GET:/qwep_interests/{interest_id}
     * @secure
     */
    getQwepInterest: (interestId: number, params: RequestParams = {}) =>
      this.request<QwepInterest, Error>({
        path: `/qwep_interests/${interestId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name UpdateQwepInterest
     * @summary метод изменения интереса
     * @request PUT:/qwep_interests/{interest_id}
     * @secure
     */
    updateQwepInterest: (
      interestId: number,
      data: QwepInterest,
      params: RequestParams = {},
    ) =>
      this.request<QwepInterest, Error>({
        path: `/qwep_interests/${interestId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name DeleteQwepInterest
     * @summary метод удаления интереса
     * @request DELETE:/qwep_interests/{interest_id}
     * @secure
     */
    deleteQwepInterest: (interestId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/qwep_interests/${interestId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  accounts = {
    /**
     * No description
     *
     * @tags QWEP
     * @name GetAccounts
     * @summary метод получения списка аккаунтов
     * @request GET:/accounts/
     * @secure
     */
    getAccounts: (params: RequestParams = {}) =>
      this.request<Accounts, Error>({
        path: `/accounts/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name CreateAccount
     * @summary метод создания аккаунта
     * @request POST:/accounts/
     * @secure
     */
    createAccount: (data: Account, params: RequestParams = {}) =>
      this.request<Account, Error>({
        path: `/accounts/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name GetAccount
     * @summary метод получения интереса
     * @request GET:/accounts/{account_id}
     * @secure
     */
    getAccount: (accountId: number, params: RequestParams = {}) =>
      this.request<Account, Error>({
        path: `/accounts/${accountId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name UpdateAccount
     * @summary метод изменения аккаунта
     * @request PUT:/accounts/{account_id}
     * @secure
     */
    updateAccount: (
      accountId: number,
      data: PutAccount,
      params: RequestParams = {},
    ) =>
      this.request<Account, Error>({
        path: `/accounts/${accountId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags QWEP
     * @name DeleteAccount
     * @summary метод удаления аккаунта
     * @request DELETE:/accounts/{account_id}
     * @secure
     */
    deleteAccount: (accountId: number, params: RequestParams = {}) =>
      this.request<InlineResponse204, Error>({
        path: `/accounts/${accountId}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
}
