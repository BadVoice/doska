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

export interface User {
  /** @format email */
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  /**
   * @format date
   * @example "2022-07-01"
   */
  date_of_birth?: string;
  phone?: string;
}

export interface UserAuth {
  email: string;
  password: string;
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
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export type Companies = Company[];

export interface Category {
  id?: string;
  name?: string;
}

export type Categories = Category[];

export interface Bid {
  id?: string;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
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
  amount: number;
  description?: string;
  /** company_id */
  company?: number;
  /** category_id */
  category: number;
}

export type Bids = Bid[];

export interface PreSearchRequest {
  search?: string;
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

export interface Filters {
  name?: string;
  article?: string;
  price?: PriceFilter;
  delivery?: DeliveryFilter;
}

export interface ExcludeFilters {
  brand?: string[];
  vendor?: string[];
  city_id?: number[];
}

export interface SearchRequest {
  search: string;
  brand: string;
  page_size?: number;
  page?: number;
  filters?: Filters;
  exclude?: ExcludeFilters;
}

export interface Item {
  itemId?: string;
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
  items?: Item[];
  filters?: SearchResponseFilters;
}

export interface SearchPagination {
  has_next: boolean;
  has_prev: boolean;
  items_count: number;
  page: number;
  pages: number;
}

export interface Vendor {
  id?: string;
  title?: string;
  site?: string;
  buskerUri?: string;
  parameters?: string[];
  cities?: string[];
  carProgram?: boolean;
  truckProgram?: boolean;
  singleSession?: boolean;
  checkout?: boolean;
  synonyms?: string;
  branches?: VendorBranches[];
  data?: VendorData;
}

export type Vendors = Vendor[];

export interface Error {
  detail: string;
}

export interface InlineResponse204 {
  success?: boolean;
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

export interface VendorBranches {
  id?: string;
  title?: string;
  site?: string;
}

export interface VendorData {
  delivery?: string;
  description?: string;
  forPhysicFaces?: boolean;
  hasPassengerProgram?: boolean;
  hasTruckProgram?: boolean;
  html?: string;
  juristTitle?: string;
  marks?: string;
  officeAddress?: string;
  parts?: string;
  payment?: string;
  phone?: string;
  rating?: string;
  regions?: string;
  schedule?: string;
  title?: string;
  tutorial?: string;
  warehouseAddress?: string;
  website?: string;
}
