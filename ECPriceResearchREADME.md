# ECPriceResearch

**An automated Korea–Japan e-commerce price and margin comparison  
personal project designed for real-world operation**

🔗 **Service**: https://jpkaresearch.store  
🔗 **GitHub**: https://github.com/kumanamu/ecprice-research

[日本語版はこちら](ECPriceResearchREADME.jp.md)

---

## 1. Project Overview

ECPriceResearch is a personal project that automates price and margin comparison
across major e-commerce platforms in Korea and Japan.

This project goes beyond simple price comparison.

- Different countries  
- Different languages  
- Different currencies  
- Different product data structures  

All of these are standardized into a single reference,
allowing users to immediately determine **where to buy and where to sell for profit**.

This project:
- Is a personal portfolio project aimed at employment in Japan  
- Was developed under the assumption of actual deployment and operation  

---

## 2. My Role & Responsibility

This project was developed as an individual project.
I was solely responsible for the entire process, from planning and design
to development, deployment, and operation.

Key responsibilities include:

- Designing cross-border (Korea–Japan) platform search logic  
- Defining and applying strict language and translation rules  
- Implementing exchange-rate–aware price comparison logic  
- SSE-based real-time result streaming  
- Designing AI analysis structure (single call, dual-stage output)  
- Configuring service deployment and operational environments  

---

## 3. Key Contributions

### 3-1. Cross-Border Price Comparison Logic

**Target Platforms**

- Amazon JP  
- Rakuten  
- Coupang  
- Naver  

Each platform provides data in different formats.
These responses are standardized into common DTOs
(`PriceInfo`, `MarginCompareResult`).

- Exchange rate API integration  
- Automatic KRW ↔ JPY conversion  
- Original price and converted price provided together  

👉 This project focuses not on simple data collection,  
👉 but on building data structures that support business decision-making.

---

### 3-2. Strict Language & Translation Rules

One of the core design principles of this project
is fixing search and translation rules as a clear “constitution.”

**Japanese Platforms**
- Japanese → Search as-is  
- Korean → Translate to Japanese, then search  
- English → Search as-is  

**Korean Platforms**
- Korean → Search as-is  
- Japanese → Translate to Korean, then search  
- English → Search as-is  

Output is also strictly separated based on KR / JP toggle,
including both language and currency formatting.

👉 This structurally prevents language and currency confusion  
👉 commonly found in global services.

---

### 3-3. AI Analysis (Basic / Premium)

- Only **one AI call per search**
- Two results generated simultaneously:

  - **Basic**: Quick, readable summary  
  - **Premium**: Detailed, in-depth analysis  

The Premium button switches output only and does not trigger a re-call.

AI analysis is not included as a cosmetic feature,
but as an auxiliary tool to interpret pricing data.

---

### 3-4. Real-Time Streaming UX (SSE)

- Implemented using Server-Sent Events (SSE)  
- Results are streamed based on platform response speed:

  Naver → Coupang → Amazon → Rakuten  

Users receive results immediately as they arrive,
creating a “research tool”–like experience without waiting.

---

## 4. Problems & Debugging

The following issues were directly analyzed and resolved during development:

- Parsing errors caused by platform-specific HTML structure changes  
- Inconsistent search results due to missing language rules  
- SSE stream interruptions during asynchronous processing  
- Full logic interruption when exchange rate API errors occurred  

Each issue was addressed through:
- Root cause analysis  
- Reproduction  
- Structural improvement  

The focus was on preventing recurrence rather than applying temporary fixes.

---

## 5. Deployment & Operation

- Spring Boot–based backend service  
- Deployed with an actual domain  
- Environment-variable–based configuration separation  
- Centralized management of API keys, exchange rates, and AI calls  

Although this is a personal project,
it was designed with the assumption that failures would occur during operation.

---

## 6. Lessons Learned

Key takeaways from ECPriceResearch:

- In global services, language rules are as important as business logic  
- Data interpretation structures create more value than raw data collection  
- Effective AI usage matters more than frequent AI usage  
- Even personal projects gain value when designed for real-world operation  

This experience significantly improved my understanding of
service development and real-world engineering
with a focus on the Japanese market.
