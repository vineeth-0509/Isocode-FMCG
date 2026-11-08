# FMCG distributor's retailer ordering app with AI order capture Client

Company A, Jabalpur. Distributor for 4 packaged food and home care brands, serving 1,800 kirana shops. 70 staff including 18 salesmen, revenue ₹85–100 c

**A mobile-first ordering app for an FMCG distributor and its kirana shops.**
Retailers order in a minute from the catalogue, or by pasting a WhatsApp-style message, or by photographing a
handwritten list. The order desk reviews, approves and exports the orders.

Built for the brief *"FMCG distributor's retailer ordering app with AI order capture"* (client: **Company A, Jabalpur**).
OrderSathi is the product name chosen for this build.

- **Live app:** https://fmdcorder.vercel.app/
- **Repository:** https://github.com/vineeth-0509/Isocode-FMCG
- **Technical Design Document:** submitted separately with this repository
- **Reviewer login:** see [Try it in 5 minutes](#try-it-in-5-minutes)

![Catalogue](docs/screenshots/catalogue.png)
![Order by message](docs/screenshots/capture.png)
![Order desk](docs/screenshots/desk.png)

---

## Contents

1. [Try it in 5 minutes](#try-it-in-5-minutes)
2. [What the app does](#what-the-app-does)
3. [The brief, requirement by requirement](#the-brief-requirement-by-requirement)
4. [How the important parts work](#how-the-important-parts-work)
5. [Architecture](#architecture)
6. [Run it locally](#run-it-locally)
7. [Security](#security)
8. [Tests](#tests)
9. [What is mocked, what was left out, known limits](#what-is-mocked-what-was-left-out-known-limits)

---

## Try it in 5 minutes

**Sign in:** enter a mobile number, press **Send code**, and use the code shown on screen (`000000`).
Demo mode is on and SMS is mocked. The login screen lists the demo accounts: tap one to fill the number.

Demo accounts:

- **Retailer** `9000000001`: Sharma General Store
- **Retailer** `9000000005`: Yadav Traders, close to its credit limit
- **Retailers** `9000000002`, `9000000003`, `9000000004`: Gupta, Patel and Jain, each with its own prices
- **Order desk** `9000000099`: sees all shops

> If the first sign-in says the database is waking up, wait a few seconds and try again. The free database sleeps when idle.

**A suggested path:**

1. **Retailer `9000000001`.** Open the catalogue. Prices, stock chips and scheme badges belong to this shop.
   The tea pack is out of stock, so it cannot be added.
2. **Tap a product.** The page shows details, a worked scheme table, and recommended products at the bottom.
3. **Add 10 cases of Glucose biscuit and 5 cases of Detergent 1 kg.** In the cart, 1 free case and a 3% discount appear.
   Place the order.
4. **Open "Order by message".** Press **Use sample message**, then **Read my message**.
   - The biscuit line asks for a size check, because "chhota" only hints at the 75 g pack.
   - The detergent line is sure.
   - The tea line is flagged out of stock.

   Remove the tea line, add the rest to the cart, and place the order. You can also try **Take photo** or
   **Upload photo** with a picture of a list.
5. **Sign out and sign in as the order desk `9000000099`.** In the order list, use **Approve** for a quick approval or
   **Review** to open an order.
6. **Open the order that came from a message.** Change the biscuit product to the 150 g pack and save: the retailer's own
   words are remembered for next time. Then confirm the order.
7. **Open the Yadav Traders order on credit hold** and press **Release and confirm**.
8. **Open "Tally export"** and export the confirmed orders to CSV.
9. **Open "Reports".** Pick two or three shops and a period such as 1 month. Choose which orders to include
   (approved, not yet approved, declined) and look at the live preview. Download the Excel file (Summary, all orders,
   a tab per shop) or the CSV.
10. On a phone, or a narrow browser window, check the bottom navigation, the large buttons and the **हिंदी** toggle.

---

## What the app does

### Retailer (phone first, English and Hindi)

- Sign in with a mobile number and a code.
- **Catalogue** with the shop's own prices, stock status, scheme badges, search and category filters.
- **Product page** with details, a worked scheme table and recommended products (other sizes, products you often order,
  products on a scheme).
- **Cart** priced by the server, with free cases and discounts shown. Order history and repeat order.
- **Order by message.** Type or paste an order, or take or upload a photo of a list. Every line shows the retailer's own
  words, a confidence level, alternative products, and a question when "case or piece" is unclear.
  Nothing is ordered until the retailer reviews it and places the order.
- Installable on the phone home screen.

### Order desk

- **Order queue** with filters. **Approve** or **Review** straight from the list.
- **Order review:** correct a product or quantity (prices and stock are recalculated), confirm, or reject with a reason.
- **Credit limits:** an order above a shop's limit goes on credit hold and can be released by the desk.
- **Learning from corrections:** when the desk fixes an AI match, the retailer's own words are saved as an alias.
- **Tally export:** confirmed orders are exported once to CSV and marked as exported.
- **Reports:** choose one or more shops, a period (1, 2 or 7 days, 1, 3 or 6 months, or custom dates) and which
  orders to include: approved (confirmed and exported), not yet approved (awaiting review and credit hold) or declined
  (rejected). See a live preview with totals by shop, then download an Excel file (Summary, all orders and a tab per
  shop) or a CSV. Reports only read data and never change an order.

### Order lifecycle

```
              place order
 retailer ───────────────────►  PLACED ──── confirm ───► CONFIRMED ── Tally export ──► EXPORTED
                                  │  ▲
        above credit limit        │  │ release (desk)
                                  ▼  │
                              CREDIT_HOLD ─── confirm (release) ───► CONFIRMED

            reject (desk, with reason; stock is returned) ───► REJECTED
```

---

## The brief, requirement by requirement

**Built**

- Installable web app, OTP login, catalogue, retailer prices, schemes, stock, repeat order and credit limit
  (OTP delivery is mocked).
- AI order capture from text (the Core Build requirement).
- Scheme engine with free goods and slab discounts, with tests (the brief's stated hard part).
- Order desk with review, credit holds and Tally export (the CSV layout is our own assumption).
- A retailer's prices and credit are visible only to them and the desk, enforced on the server.
- Hindi and English on the retailer screens.
- Prices show whether GST is included (prices exclude GST and are labelled).
- A fast first load and large tap targets (designed for slow 3G; measured results are in the TDD).

**Built as extra depth (beyond the Core Build, or not in the brief)**

- AI order capture from a photo of a list.
- Reports by shop, period and order status (approved, not yet approved, declined), as Excel or CSV.
- Product pages with recommendations.

**Not built**

- AI order capture from a Hindi voice note.
- Salesman role and offline orders.
- Van loading lists.
- Dashboard of retailers with no order in 14 days.

**Out of scope in the brief**

- Delivery tracking, payments in the app, and GST e-invoicing.

---

## How the important parts work

### 1. Scheme engine

A pure function in [`src/server/schemes/engine.ts`](src/server/schemes/engine.ts). It has no database and no AI.

- **Glucose biscuit, buy 10 cases get 1 free:** every full 10 cases paid earns 1 free case.
  Examples: 10 cases → 11 delivered; 20 → 22; 25 → 27.
- **Detergent 1 kg, 3% off at 5 or more cases:** the discount applies to the whole line.
  Examples: 4 cases → no discount; 5 cases → 3% off.
- Prices are **per piece**, so a case costs piece price × pieces per case (₹8.10 × 96 = ₹777.60).
- All money is **integer paise** and percentages are **basis points**, so there are no rounding drifts.
- Free cases count against stock. Out-of-stock and over-stock lines are blocked.

### 2. AI order capture (text and photo)

```
 message or photo ─► keyword matcher (aliases, past orders, spelling, sizes) ─┐
                 └─► Google Gemini: items, quantities, product code ──────────┤
                                                                              ▼
                              validate every field, drop unknown product codes
                                                                              ▼
                  cross-check: disagreement ⇒ "Please check"; unclear unit ⇒ ask
                                                                              ▼
              retailer reviews each line ─► adds to cart ─► places the order
```

- **AI only suggests.** The model sees the product list and the retailer's saved words. It never sees prices or stock and
  cannot decide a discount. Anything inside a message or photo is treated as data, not instructions.
- **When the AI is wrong or unsure, the app shows it:**
  - a confidence chip on every line (Sure, Please check, Not sure, No match);
  - alternative products as one-tap choices, plus a full product picker;
  - unclear units (case or piece) are asked, never guessed;
  - out-of-stock matches are flagged and blocked;
  - invalid output, a timeout or a missing key falls back to the keyword matcher, with a notice on screen;
    a photo that cannot be read asks the retailer to retake it or type the order.
- **Photos** are shrunk in the browser before upload, checked by their real file type and size on the server, sent to
  Google to be read, and **not stored**. Only the text that was read is kept.
- **Learning:** when the desk changes a match, the retailer's words are saved as an alias and used next time with high
  confidence.
- Recommendations on the product page are simple rules over the retailer's own order history. They are **not AI**.

### 3. Orders, stock and credit

- Placing an order locks the stock rows inside a database transaction, re-prices everything on the server and
  deducts stock, so two orders cannot take the same cases.
- If outstanding credit plus the order total would pass the shop's limit, the order goes on **credit hold** for the desk.
- Rejecting an order returns its stock. Correcting a line moves stock and recalculates totals.
- Every state change is written to an order history that both the desk and the retailer can see.

### 4. Reports and exports

- **Tally export:** one row per order line, exported once, then orders are marked as exported.
- **Reports:** read-only. Shops, period and order statuses are validated on the server, with a row limit.
  The Excel file is generated without any extra package.

---

## Architecture

**One Next.js app** (App Router, TypeScript) with a PostgreSQL database through Prisma. One deployable unit keeps it simple
and fast; the server logic lives in its own layer inside the project.

- **Frontend:** Next.js, React, Tailwind CSS (server components where possible, small client bundles).
- **Backend:** Next.js route handlers and a `server/` module layer.
- **Database:** PostgreSQL with Prisma (migrations and a seed script).
- **Sign-in:** mobile number and one-time code, signed httpOnly session cookie, roles `RETAILER` and `DESK`.
- **AI:** Google Gemini over REST, validated with Zod.
- **Hosting:** Vercel and a hosted PostgreSQL (Neon).

```
src/
  app/                 Routes: /login, /retailer/*, /desk/*, /api/*
  components/          UI (catalogue, product, cart, capture, desk, reports) and shared primitives
  lib/                 Money helpers, auth (token, session, OTP), validation, translations, brand
  server/
    schemes/engine.ts  Pure scheme engine
    pricing.ts         Prices a cart from server-side data; stock and credit rules
    orders.ts          Place, confirm, reject and correct orders (transactions, stock locks)
    product.ts         Scheme examples and recommendations for the product page
    capture/           Message and photo reading: keyword rules, Gemini step, validation
    export/            Tally CSV builder and a small Excel (.xlsx) writer
    reports/           Period maths, report rows, summary and workbook
prisma/                Schema and seed data
public/                Manifest, service worker, icons, optional product photos
scripts/               List Gemini models, generate optional product pictures
tests/                 Unit tests for the logic that matters most
docs/                  Assumptions and limits
```

**Data model:** `Retailer`, `User`, `Sku`, `RetailerPrice` (per-shop prices), `Scheme`, `Order`, `OrderLine`, `OrderEvent`
(history), `Alias` (a shop's own words for a product), `Capture` (what was read from a message or photo), `OtpCode`.

---

## Run it locally

Needs Node.js 20+ and a PostgreSQL database.

```bash
git clone <repository-url>
cd ordersathi
npm install                  # also runs "prisma generate"
cp .env.example .env         # then fill in the values (names only are in the example)
npm run db:migrate           # create the tables
npm run db:seed              # load the sample data
npm run dev                  # http://localhost:3000
```

**Environment variables:**

- `DATABASE_URL`: PostgreSQL connection string.
- `SESSION_SECRET`: signs the session cookie (32+ random characters).
- `OTP_DEMO_MODE` and `OTP_DEMO_CODE`: demo mode, where every login code is `OTP_DEMO_CODE` (reviewer access).
- `NEXT_PUBLIC_DEMO_HINTS`: shows the demo accounts on the login screen.
- `NEXT_PUBLIC_BRAND_NAME`: the app name shown in the headers.
- `LLM_API_KEY` and `LLM_MODEL`: Google AI key and Gemini model for AI capture (optional).

Full deployment steps and every variable are in **[deployment.md](deployment.md)**.

**Commands:**

- `npm run dev`: start the dev server (pages compile on first visit, so it feels slower).
- `npm run build` then `npm start`: production build and server (real speed).
- `npm test`: run the unit tests.
- `npm run typecheck`: TypeScript check.
- `npm run db:migrate` and `npm run db:deploy`: create migrations (development) and apply them (production).
- `npm run db:seed`: load the sample data (safe to re-run).
- `npm run ai:models`: list the Gemini models your key can use.
- `npm run ai:images`: optional, generate product pictures with a Google image model.

---

## Security

- Signed, httpOnly session cookie; route guards in middleware **and** on every API route; roles are checked on the server.
- **A retailer can only reach their own prices, credit, orders and aliases.** Every retailer query is scoped by the
  retailer id from the session, never from the request.
- Zod validation on every input; a same-origin check on writes; OTP expiry, attempt limits and rate limiting.
- Uploaded photos are checked by their real file type and size and are not stored.
- CSV and Excel exports neutralise spreadsheet formula injection.
- No secrets in the repository: `.env` is git-ignored and `.env.example` lists names only.

---

## Tests

`npm test` covers the logic that matters most:

- the **scheme engine** (thresholds, free goods, slab discount, rounding, invalid input);
- **cart pricing**, stock rules (free cases count) and credit decisions;
- **message matching**, including the brief's sample message, spelling mistakes, Devanagari words, aliases and unit questions;
- photo file-type checks and **input validation**;
- session tokens and one-time codes;
- the **Tally CSV**, report periods, report rows and the Excel writer.

Database flows (placing orders, stock locking, desk actions) and the screens were checked by hand and are **not**
covered by automated tests.

---

## What is mocked, what was left out, known limits

**Mocked (the brief allows it)**

- SMS delivery. In demo mode every code is `000000`.
- Tally: the export is a CSV file, not a live integration.
- WhatsApp: the retailer pastes the message instead of connecting an account.

**Left out on purpose**

- Salesman role and offline orders, Hindi voice notes, van loading lists, the 14-day no-order dashboard, and the
  three items the brief puts out of scope (delivery tracking, payments in the app, GST e-invoicing).

**Our assumptions** (the full list is in [docs/assumptions-and-limits.md](docs/assumptions-and-limits.md))

- Dealer prices are per piece, not per case.
- "Buy 10 get 1" means every full 10 cases earns 1 free; free cases come out of stock.
- The 3% slab applies to the whole line once the threshold is reached.
- Prices exclude GST and are labelled; GST invoicing stays in Tally.
- Credit limits and balances are seeded; the Tally CSV layout and the order statuses are our own design.
- Only three products and their prices, stock and schemes come from the brief. The other products, the shops, their
  prices and the sample orders are **invented** for the demo.

**Known limits**

- Handwriting can be misread, which is why every AI line is shown for the retailer to check.
- A free hosted database sleeps when idle, so the first sign-in can take a few seconds.
- Performance figures come from the deployed app and are reported in the TDD, not assumed here.