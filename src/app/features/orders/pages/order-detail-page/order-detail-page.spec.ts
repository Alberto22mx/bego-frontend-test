import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { OrderDetail } from '../../../../core/models/order.model';
import { OrdersService } from '../../../../core/services/orders.service';
import { OrderDetailPage, timelineForStatus } from './order-detail-page';

describe('OrderDetailPage status rules', () => {
  let currentOrder: OrderDetail;

  beforeEach(() => {
    currentOrder = createOrder(1);
    TestBed.configureTestingModule({
      imports: [OrderDetailPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ orderId: 'order-id' }) } },
        },
        {
          provide: OrdersService,
          useValue: { getOrderDetail: () => of(currentOrder) },
        },
      ],
    });
  });

  afterEach(() => vi.restoreAllMocks());

  function render(statusCode: number): {
    fixture: ComponentFixture<OrderDetailPage>;
    element: HTMLElement;
  } {
    currentOrder = createOrder(statusCode);
    const fixture = TestBed.createComponent(OrderDetailPage);
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('maps completed timeline steps from different statusCode values', () => {
    expect(timelineForStatus(0).map(({ completed }) => completed)).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(timelineForStatus(2).map(({ completed }) => completed)).toEqual([
      true,
      true,
      true,
      false,
    ]);
    expect(timelineForStatus(3).every(({ completed }) => completed)).toBe(true);
  });

  it('renders only the timeline steps completed by the current status', () => {
    const { element } = render(1);
    expect(element.querySelectorAll('.timeline__step--completed')).toHaveLength(2);
  });

  it('disables Track Order when statusCode is less than 3', () => {
    const { element } = render(2);
    expect(element.querySelector<HTMLButtonElement>('.track-button')?.disabled).toBe(true);
  });

  it('enables Track Order when statusCode is 3 or greater', () => {
    const { element } = render(3);
    expect(element.querySelector<HTMLButtonElement>('.track-button')?.disabled).toBe(false);
  });

  it("logs 'Track Order' when the enabled button is clicked", () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const { element } = render(3);

    element.querySelector<HTMLButtonElement>('.track-button')?.click();

    expect(log).toHaveBeenCalledWith('Track Order');
  });

  function createOrder(statusCode: number): OrderDetail {
    const pickupTime = new Date('2026-08-06T12:00:00Z');
    const dropoffTime = new Date('2026-08-06T14:00:00Z');
    return {
      id: 'order-id',
      orderNumber: '7804GNZ',
      referenceNumber: 'A1180',
      type: 'FTL',
      statusCode,
      statusLabel: 'Status',
      startsAt: pickupTime,
      endsAt: dropoffTime,
      driverName: 'Driver',
      driverThumbnailUrl: null,
      destinations: [
        {
          address: 'Pickup address',
          startsAt: pickupTime,
          endsAt: pickupTime,
          label: 'Pickup',
          navigationAvailable: false,
        },
        {
          address: 'Dropoff address',
          startsAt: dropoffTime,
          endsAt: dropoffTime,
          label: 'Dropoff',
          navigationAvailable: false,
        },
      ],
      timeline: [],
      pickupData: null,
    };
  }
});
