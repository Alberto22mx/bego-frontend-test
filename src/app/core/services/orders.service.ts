import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiResponseDto,
  OrderDetailDto,
  OrderSummaryDto,
} from '../models/order.dto';
import {
  OrderDetail,
  OrderDestination,
  OrderSummary,
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUpcomingOrders(): Observable<readonly OrderSummary[]> {
    return this.http
      .get<ApiResponseDto<readonly OrderSummaryDto[]>>(`${this.apiUrl}/orders/upcoming`)
      .pipe(map(({ result }) => result.map(mapOrderSummary)));
  }

  getOrderDetail(): Observable<OrderDetail> {
    return this.http
      .get<ApiResponseDto<OrderDetailDto>>(`${this.apiUrl}/orders`)
      .pipe(map(({ result }) => mapOrderDetail(result)));
  }
}

function mapOrderSummary(dto: OrderSummaryDto): OrderSummary {
  return {
    id: dto._id,
    orderNumber: dto.order_number,
    statusCode: dto.status,
    statusLabel: dto.status_string,
    type: dto.type,
    startsAt: new Date(dto.start_date),
    endsAt: new Date(dto.end_date),
    isToday: dto.is_today,
    driverThumbnailUrl: normalizeImageUrl(dto.driver_thumbnail),
    destinations: dto.destinations.map(mapDestination),
  };
}

function mapDestination(dto: OrderSummaryDto['destinations'][number]): OrderDestination {
  return {
    address: dto.address,
    startsAt: new Date(dto.start_date),
    endsAt: new Date(dto.end_date),
    label: dto.nickname,
    navigationAvailable: dto.show_navigation,
  };
}

function mapOrderDetail(dto: OrderDetailDto): OrderDetail {
  return {
    id: dto._id,
    orderNumber: dto.order_number,
    referenceNumber: dto.reference_number ?? null,
    startsAt: new Date(dto.start_date),
    endsAt: new Date(dto.end_date),
  };
}

function normalizeImageUrl(url: string | null): string | null {
  const normalizedUrl = url?.trim();
  return normalizedUrl ? normalizedUrl : null;
}
