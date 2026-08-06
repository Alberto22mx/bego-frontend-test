export interface OrderDestination {
  readonly address: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly label: string;
  readonly navigationAvailable: boolean;
}

export interface OrderSummary {
  readonly id: string;
  readonly orderNumber: string;
  readonly statusCode: number;
  readonly statusLabel: string;
  readonly type: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly isToday: boolean;
  readonly driverThumbnailUrl: string | null;
  readonly destinations: readonly OrderDestination[];
}

export interface OrderDetail {
  readonly id: string;
  readonly orderNumber: string;
  readonly referenceNumber: string | null;
  readonly startsAt: Date;
  readonly endsAt: Date;
}
