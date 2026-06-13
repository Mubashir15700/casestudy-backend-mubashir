# System Design & Scalability

## 1. API Design Rationale

The API is organized around business domains such as authentication, wallets, transactions, and webhooks. This keeps responsibilities separated and makes the API easier to maintain and extend.

Endpoints follow REST conventions:

* `POST /auth/*` for authentication actions
* `GET /users/me` for profile retrieval
* `GET /wallets/me` for wallet information
* `POST /wallets/transfer` for fund transfers
* `GET /transactions` for transaction history

All responses follow a consistent envelope:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Benefits:

* Predictable response format for clients
* Easier frontend integration
* Consistent error handling across all endpoints
* Simplified API documentation

Protected endpoints use JWT access tokens while refresh tokens are used for session renewal and rotation.

---

## 2. Concurrency & Race Conditions

The primary race condition is double spending, where multiple transfer requests attempt to spend the same wallet balance simultaneously.

To prevent this:

1. Transfers execute inside a database transaction.
2. Sender and recipient wallet updates are performed atomically.
3. The sender balance is verified before debiting funds.
4. Transfers support idempotency using a unique idempotency key.
5. Duplicate requests with the same idempotency key return the existing transaction instead of creating a new one.

This ensures:

* No partial transfers
* No duplicate transfers from retries
* Consistent balances even under concurrent requests

In a production-scale system, I would additionally use PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) to guarantee serialized access to wallet rows during transfers.

---

## 3. Scaling the Job Worker

At 1 million jobs per day, a single polling worker would become a bottleneck.

I would evolve the architecture as follows:

### Horizontal Worker Scaling

Run multiple worker instances across multiple servers or containers.

### Stronger Job Claiming

Use PostgreSQL row-level locking with:

```sql
SELECT ... FOR UPDATE SKIP LOCKED
```

This allows many workers to safely process jobs concurrently without conflicts.

### Queue Technology

Replace database polling with a dedicated queue system such as:

* Redis + BullMQ
* RabbitMQ
* Apache Kafka

Benefits:

* Lower database load
* Higher throughput
* Better retry handling
* Delayed jobs and scheduling support

### Worker Separation

Different job types would be processed by dedicated worker groups:

* Receipt workers
* Payment processing workers
* Notification workers

This prevents heavy workloads in one category from affecting others.

---

## 4. Bottleneck Identification

At approximately 2 million transactions per day, the first bottlenecks would likely be:

### Transactions Table Growth

The transactions table would grow rapidly and queries would become slower.

Improvements:

* Table partitioning by date
* Archiving historical data
* Optimized indexes for common queries

### Transaction History API

Queries filtering transactions by wallet and sorting by creation date would become expensive.

Improvements:

* Composite indexes
* Cursor-based pagination
* Read replicas for reporting workloads

### Job Polling

Continuous polling of the jobs table would generate unnecessary database load.

Improvements:

* Dedicated queue infrastructure
* Event-driven processing

### Single Database Instance

A single PostgreSQL instance would eventually become the main scalability limit.

Improvements:

* Read replicas
* Connection pooling
* Database sharding if required

---

## 5. Observability

### Logs

I would implement structured logging for:

* Authentication events
* Wallet credits
* Transfers
* Webhook processing
* Job execution
* Failed jobs
* System errors

Each log entry would include:

* Timestamp
* Request ID
* User ID (when available)
* Transaction ID (when available)

### Metrics

Important metrics include:

* Requests per second
* API latency
* Error rate
* Transfer success rate
* Job queue depth
* Job processing time
* Database query latency
* Worker retry count

### Alerts

Critical alerts would be configured for:

* Failed job rate above threshold
* Database connectivity failures
* High API error rates
* Excessive transfer failures
* Worker downtime
* Queue backlog growth
* Unusually slow response times

These metrics and alerts would provide early detection of operational issues and help maintain system reliability in production.
