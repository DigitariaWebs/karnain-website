# Specs — spec-driven development

Specs are the contract between intent (PM/design) and implementation (agents/devs) for **feature-track** work. They are deliberately lean — one page per artifact — because a spec nobody reviews honestly is process theater (Constitution, Art. II).

## Lifecycle

```
/create-spec  → specs/NNN-slug/spec.md        status: draft → active
/plan-feature → plan.md + tasks.md            (clarifications resolved first)
/implement-feature                            (tasks tick as they complete)
ship → /update-docs                           status: shipped; learnings distilled
                                              into docs/product/features/<slug>.md
```

- Numbering: `NNN` is the next integer; slug is kebab-case (`001-task-list`). Branch name matches: `feat/001-task-list`.
- One active spec per slice at a time — `/plan-feature` flags overlaps ("areas touched") across active specs before any code exists.
- Shipped specs stay in place (history is useful) but the **living truth** moves to `docs/product/features/`. A spec older than its feature doc is expected; never "fix" old specs.
- Experiments use the same flow with `Type: experiment` and learning-goal acceptance criteria (see `docs/process/painted-door.md`).

## Artifacts (templates in [TEMPLATE/](TEMPLATE/))

| File       | Owner        | Answers                                                    |
| ---------- | ------------ | ---------------------------------------------------------- |
| `spec.md`  | PM/requester | What, for whom, why now, acceptance criteria, out of scope |
| `plan.md`  | Dev/agent    | How: design, layer placement, risks, AC→test mapping       |
| `tasks.md` | Dev/agent    | Ordered checkboxed steps an agent can execute and tick     |

## Index

| #                                             | Spec                                                  | Status  |
| --------------------------------------------- | ----------------------------------------------------- | ------- |
| [001](001-brand-foundation-homepage/spec.md)  | Brand foundation & luxury homepage                    | shipped |
| [002](002-shop-product-and-cart/spec.md)      | Shop — product page & guest bag                       | shipped |
| [003](003-collection-page/spec.md)            | Collection page with scent-family filters             | shipped |
| [004](004-editorial-instagram/spec.md)        | Editorial campaign + Instagram strip                  | shipped |
| [005](005-supabase-admin/spec.md)             | Supabase data layer + admin back office               | shipped |
| [006](006-polish-handoff/spec.md)             | Polish & handoff                                      | shipped |
| 007 · 008                                     | 3D video hero + brand logo (lightweight, no spec dir) | shipped |
| [009](009-catalog-enrichment/spec.md)         | Catalog enrichment: real copy, draft status, badges   | shipped |
| [010](010-admin-image-upload/spec.md)         | Admin image upload (Supabase Storage)                 | shipped |
| [011](011-checkout-orders/spec.md)            | Checkout (Stripe) + orders back office                | shipped |
| [012](012-admin-integration-settings/spec.md) | Admin-managed integration settings (secure)           | shipped |
| [001-task-list](001-task-list/spec.md)        | Skeleton demo (template reference)                    | example |
