import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OrderSummary } from '../../../../core/models/order.model';
import { OrderCard, formatRemainingPickupTime } from './order-card';

describe('OrderCard', () => {
  const order: OrderSummary = {
    id: 'real-order-id',
    orderNumber: 'display-number',
    statusCode: 1,
    statusKey: 'assigned',
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
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-06T11:00:00Z'));
    TestBed.configureTestingModule({
      imports: [OrderCard],
      providers: [provideRouter([]), provideLocationMocks()],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function render(currentOrder: OrderSummary = order): {
    fixture: ComponentFixture<OrderCard>;
    element: HTMLElement;
  } {
    const fixture = TestBed.createComponent(OrderCard);
    fixture.componentRef.setInput('order', currentOrder);
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('links Resume to the detail route using the real order id', () => {
    const { element } = render();
    const resume = element.querySelector<HTMLAnchorElement>('.resume-action');

    expect(resume?.getAttribute('href')).toBe('/orders/real-order-id');
    expect(resume?.getAttribute('href')).not.toContain(order.orderNumber);
  });

  it('shows a countdown for a future startsAt', () => {
    const { element } = render();
    expect(element.querySelector('.pickup-action')?.tagName).toBe('P');
    expect(element.querySelector('[role="timer"]')?.textContent).toContain('01:00:00');
    expect(TestBed.inject(Location).path()).toBe('');
  });

  it('formats the remaining duration as HH:mm:ss', () => {
    expect(formatRemainingPickupTime(5_400_000)).toBe('01:30:00');
  });

  it('shows Navigate immediately when startsAt has expired', () => {
    const expiredOrder = { ...order, startsAt: new Date('2026-08-06T10:00:00Z') };
    const { element } = render(expiredOrder);

    expect(
      element.querySelector<HTMLButtonElement>('button.pickup-navigate')?.textContent,
    ).toContain('Navigate');
    expect(element.querySelector('[role="timer"]')).toBeNull();
  });

  it('changes the countdown to Navigate when it reaches zero', () => {
    const { fixture, element } = render();

    vi.advanceTimersByTime(3_600_000);
    fixture.detectChanges();

    expect(element.querySelector('[role="timer"]')).toBeNull();
    expect(element.querySelector('button.pickup-navigate')).toBeTruthy();
  });

  it("logs 'Navigate' when the navigation button is clicked", () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const expiredOrder = { ...order, startsAt: new Date('2026-08-06T10:00:00Z') };
    const { element } = render(expiredOrder);

    element.querySelector<HTMLButtonElement>('button.pickup-navigate')?.click();

    expect(log).toHaveBeenCalledWith('Navigate');
  });

  it('clears the pickup timer when the card is destroyed', () => {
    const { fixture } = render();
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    fixture.destroy();

    expect(vi.getTimerCount()).toBe(0);
  });
});
