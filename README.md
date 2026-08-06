# BeGo Frontend Technical Test

A mobile-first Angular application for displaying upcoming cargo orders and the available details for a selected order. The project consumes the REST mock API provided as part of the BeGo frontend technical assessment.

The current implementation includes an upcoming orders list, loading and error handling, responsive order cards, route summaries, avatar fallbacks, and a cargo detail screen for the order exposed by the mock detail endpoint.

## Technologies

- Angular 22 with standalone components
- TypeScript with strict compiler and template checks
- SCSS
- Angular Signals for local page state
- Angular `HttpClient` for API communication
- Angular Router
- Vitest for unit tests

No external UI frameworks or icon libraries are used.

## Requirements

- Node.js version compatible with Angular 22
- npm (the project currently declares npm 11 as its package manager)
- A modern web browser
- Internet access to consume the public mock API

## Installation

Install the project dependencies:

```bash
npm install
```

## Development

Start the local development server:

```bash
npm start
```

Open `http://localhost:4200` in a browser. The root route redirects to `/orders`.

The development server uses `src/environments/environment.development.ts`.

## Production build

Create an optimized production build:

```bash
npm run build
```

The output is generated in the `dist/` directory. Production builds use `src/environments/environment.ts`.

## Tests

Run the unit test suite once with Vitest:

```bash
npm test -- --watch=false
```

## Main project structure

```text
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   ├── order.dto.ts
│   │   │   └── order.model.ts
│   │   └── services/
│   │       └── orders.service.ts
│   ├── layout/
│   │   ├── app-header/
│   │   └── app-shell/
│   ├── shared/
│   │   └── components/
│   │       └── avatar/
│   ├── features/
│   │   └── orders/
│   │       ├── components/
│   │       │   ├── order-card/
│   │       │   ├── order-list/
│   │       │   ├── order-route/
│   │       │   ├── order-timeline/
│   │       │   └── orders-tabs/
│   │       └── pages/
│   │           ├── order-detail-page/
│   │           └── orders-page/
│   ├── app.config.ts
│   └── app.routes.ts
└── environments/
    ├── environment.development.ts
    └── environment.ts
```

## Architecture decisions

### Standalone and feature-oriented structure

The application uses standalone Angular components and lazy-loaded route components. Order-specific pages and presentation components are grouped under the `orders` feature. API access and shared domain contracts remain in `core`, while the responsive shell and header live under `layout`.

The scope intentionally avoids state-management libraries such as NgRx. Page-level asynchronous state is small enough to manage with Angular Signals, while `HttpClient` continues to expose Observables for requests.

### DTOs and UI models

API DTOs and UI models are defined separately:

- `order.dto.ts` describes the mock API payload, including its snake_case fields and endpoint-specific structures.
- `order.model.ts` describes normalized models consumed by the components.
- `OrdersService` maps DTOs into UI models, converts numeric timestamps to `Date` instances, normalizes empty image URLs, and adapts the detail timeline labels used by the interface.

This separation prevents backend naming and response inconsistencies from leaking into presentation components.

### Environment configuration

The API base URL is defined through Angular environments:

- `environment.development.ts` is selected by the development build through `fileReplacements` in `angular.json`.
- `environment.ts` is used by the production build.

Both environments currently point to the same public mock API. This can be changed later without modifying `OrdersService`.

## Routing

- `/orders` displays upcoming cargo orders.
- `/orders/:orderId` displays cargo details when the selected ID matches the single order returned by the detail mock.
- Unknown routes redirect to `/orders`.

The application header adapts its title to the active route, and the detail back button navigates explicitly to `/orders`.

## Responsive design and accessibility

The interface is mobile-first and supports narrow screens starting at approximately 320 px. On wider screens, the application remains centered with a maximum width of approximately 420 px.

Responsive considerations include:

- Text containers that can shrink without causing horizontal scrolling.
- Controlled two-line truncation for long addresses.
- Ellipsis for status badges, order references, and driver names.
- Compact spacing and reordered card headers on very narrow screens.
- Visible keyboard focus for links, tabs, and buttons.
- Semantic page, list, article, navigation, and timeline markup.
- Accessible labels for icon-only buttons.
- Reduced animation when `prefers-reduced-motion` is enabled.

## UI and request states

The upcoming orders page supports:

- Loading state
- Successful results
- Empty results
- Error state with retry

The order detail page supports:

- Loading state
- Successful result
- API or order-ID mismatch error with retry

Driver images use a local inline SVG avatar fallback when the API returns no image URL or when the remote image fails to load.

## Known mock API limitations

- `/orders/upcoming` returns multiple order summaries.
- `/orders` returns only one detailed order rather than a collection.
- There is no `/orders/:id` endpoint.
- Only the list order whose ID matches the fixed `/orders` response can display the complete detail screen.
- The `Upcoming`, `Completed`, and `Past` tabs do not have independent endpoints available; only `Upcoming` currently loads data.
- Search is currently visual only and does not filter orders.
- `Track Order` has no behavior because the assessment does not define an API or action for tracking.

## Deployment

Deployment URL: _To be added after deployment._
