import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OrderSummary } from '../../../../core/models/order.model';
import { OrderCard } from './order-card';

describe('OrderCard', () => {
  const order: OrderSummary = {
    id: 'real-order-id',
    orderNumber: 'display-number',
    statusCode: 1,
    statusLabel: 'Order assigned',
    type: 'FTL',
    startsAt: new Date('2026-08-06T12:00:00Z'),
    endsAt: new Date('2026-08-06T13:00:00Z'),
    isToday: true,
    driverThumbnailUrl: null,
    destinations: [
      {
        address: 'Pickup address',
        startsAt: new Date('2026-08-06T12:00:00Z'),
        endsAt: new Date('2026-08-06T13:00:00Z'),
        label: 'Pickup',
        navigationAvailable: true,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderCard],
      providers: [provideRouter([]), provideLocationMocks()],
    });
  });

  it('links Resume to the detail route using the real order id', () => {
    const fixture = TestBed.createComponent(OrderCard);
    fixture.componentRef.setInput('order', order);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const resume = element.querySelector<HTMLAnchorElement>('.resume-action');

    expect(resume?.getAttribute('href')).toBe('/orders/real-order-id');
    expect(resume?.getAttribute('href')).not.toContain(order.orderNumber);
  });

  it('shows the local pickup message without changing the current route', () => {
    const fixture = TestBed.createComponent(OrderCard);
    fixture.componentRef.setInput('order', order);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const pickup = element.querySelector<HTMLButtonElement>('.pickup-action');
    pickup?.click();
    fixture.detectChanges();

    expect(element.querySelector('.pickup-message')).toBeTruthy();
    expect(TestBed.inject(Location).path()).toBe('');
  });
});
