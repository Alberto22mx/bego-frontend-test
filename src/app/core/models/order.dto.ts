export interface ApiResponseDto<T> {
  readonly status: number;
  readonly result: T;
}

export interface OrderDestinationDto {
  readonly address: string;
  readonly start_date: number;
  readonly end_date: number;
  readonly nickname: string;
  readonly show_navigation: boolean;
}

export interface OrderSummaryDto {
  readonly _id: string;
  readonly status: number;
  readonly order_number: string;
  readonly type: string;
  readonly type: string;
  readonly destinations: readonly OrderDestinationDto[];
  readonly start_date: number;
  readonly end_date: number;
  readonly is_today: boolean;
  readonly status_string: string;
  readonly driver_thumbnail: string | null;
}

export interface OrderDetailDto {
  readonly _id: string;
  readonly status: number;
  readonly order_number: string;
  readonly reference_number?: string | null;
  readonly start_date: number;
  readonly end_date: number;
  readonly driver: {
    readonly nickname: string;
    readonly thumbnail: string | null;
  };
  readonly destinations: readonly OrderDetailDestinationDto[];
  readonly status_list: {
    readonly pickup: readonly OrderStatusStepDto[];
    readonly dropoff: readonly OrderStatusStepDto[];
  };
}

export interface OrderDetailDestinationDto {
  readonly address: string;
  readonly startDate: number;
  readonly endDate?: number;
  readonly status_string: string;
  readonly contact_info?: {
    readonly name?: string | null;
    readonly telephone?: string | null;
    readonly email?: string | null;
  };
}

export interface OrderStatusStepDto {
  readonly active: boolean;
  readonly status: string;
}
