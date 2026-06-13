# AI Usage Declaration

**Case Study**
Candidate Name: Mubashir
Submission Date: 14 Jun 2026

---

## Section 1 — Tools Used

| Tool      | Version / Mode      | Used For                                                                                                                                                                 |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ChatGPT   | GPT-5.5             | Architecture discussions, API design, Prisma schema review, authentication flow, transfer design, background worker design, debugging assistance, documentation drafting |
| Cursor AI | Inline AI Assistant | Project setup, Express server setup, PostgreSQL/Prisma configuration assistance, code completion                                                                         |
| Gemini    | Gemini Web App      | Docker-related questions and containerization guidance                                                                                                                   |

---

## Section 2 — Usage Breakdown by Task

### Authentication & JWT Implementation

* **Did you use AI here?** Yes
* **What did you ask / prompt for?**

  * JWT authentication flow
  * Access token and refresh token design
  * Refresh token rotation
  * Logout strategy
* **What did AI suggest?**

  * JWT-based authentication with access and refresh tokens
  * Refresh token storage and revocation patterns
  * Protected route middleware structure
* **What did you change, reject, or fix — and why?**

  * Adapted the suggestions to fit my project structure and middleware organization.
  * Adjusted validation and error handling to match the API response format used throughout the project.

---

### Database Schema & Migrations

* **Did you use AI here?** Yes
* **What did you ask / prompt for?**

  * Wallet service schema design
  * Prisma model relationships
  * Transaction and job table structure
* **What did AI suggest?**

  * User, Wallet, Transaction, RefreshToken, and Job models
  * Transaction status and job status enums
  * Index recommendations
* **What did you change, reject, or fix — and why?**

  * Modified field names and relationships to better match the case study requirements.
  * Added fields and constraints based on implementation needs discovered during development and testing.

---

### Wallet Transfer Endpoint (atomicity + locking)

* **Did you use AI here?** Yes
* **What did you ask / prompt for?**

  * Transfer flow design
  * Idempotency handling
  * Concurrency considerations
* **What did AI suggest?**

  * Database transactions for atomic transfers
  * Idempotency key support
  * Row-locking concepts and double-spend prevention strategies
* **What did you change, reject, or fix — and why?**

  * Adapted the implementation to fit Prisma and my schema.
  * Reviewed all logic before implementation and adjusted validation and transaction handling where needed.
  * Simplified some recommendations to keep the solution aligned with the scope of the assignment.

---

### Background Job Worker

* **Did you use AI here?** Yes
* **What did you ask / prompt for?**

  * Job queue architecture
  * Worker polling strategy
  * Retry and backoff implementation
* **What did AI suggest?**

  * Database-backed job queue
  * Background worker polling every few seconds
  * Exponential retry strategy
  * Claimed job processing pattern
* **What did you change, reject, or fix — and why?**

  * Reorganized the code into separate worker, processor, and handler modules.
  * Adjusted the implementation to match the provided case study requirements.
  * Fixed integration issues discovered during development.

---

### System Design Answers (design.md)

* **Did you use AI here?** Yes
* **What did you ask / prompt for?**

  * Design rationale
  * Scalability considerations
  * Observability recommendations
* **What did AI suggest?**

  * Discussion points around concurrency, scaling, bottlenecks, and monitoring
* **What did you change, reject, or fix — and why?**

  * Tailored the answers to match the architecture actually implemented in this project.
  * Removed recommendations that did not apply to the current solution.

---

## Section 3 — What You Deliberately Did NOT Use AI For

I performed the actual implementation, integration, debugging, migration execution, and end-to-end testing myself. While AI was used as a reference and design assistant, I manually connected all modules, validated API behavior, fixed runtime issues, resolved Prisma migration problems, and verified the overall application flow.

---

## Section 4 — Reflection

### Q1: Where did AI help you most in this case study?

AI was most helpful in discussing architecture and implementation approaches before coding. It accelerated decision-making around database design, transaction handling, and background job processing. It also helped identify edge cases and provided alternative implementation options that I could evaluate before choosing an approach.

### Q2: Where did AI lead you astray, give you something wrong, or that you had to significantly correct?

Some generated suggestions did not fit my exact Prisma setup, project structure, or assignment requirements and required modification. In several cases, code examples referenced different imports, abstractions, or assumptions that were not applicable to my implementation. I reviewed and adjusted these suggestions before integrating them into the project.

---

## Section 5 — Honesty Declaration

* [x] I have disclosed all AI tools I used in this submission.
* [x] The code I submitted is code I understand and can explain line by line.
* [x] I have not copied a submission from another candidate or public repository.

**Signed:** Mubashir
**Date:** 14 Jun 2026

---
