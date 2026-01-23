# Database Testing

## Overview

Database testing verifies the integrity, security, performance, and accuracy of data stored in database systems. It ensures that data operations (CREATE, READ, UPDATE, DELETE) work correctly and that data remains consistent, valid, and secure.

## Why Database Testing Matters

### The Cost of Data Errors

**Real-World Incidents:**
- **Knight Capital (2012)**: Database error caused $440 million loss in 45 minutes
- **British Airways (2017)**: Data center failure grounded flights, cost £80 million
- **Target (2013)**: Database breach exposed 40 million credit cards

**Common Data Issues:**
- Corrupted data in production
- Lost transactions during failures
- Duplicate records
- Orphaned data after deletions
- Inconsistent data across microservices
- SQL injection vulnerabilities
- Poor query performance at scale

### What Makes Database Testing Different

**Application Testing vs Database Testing:**

| Application Testing | Database Testing |
|---------------------|------------------|
| Tests business logic | Tests data integrity |
| Focuses on UI/API behavior | Focuses on data operations |
| Validates user workflows | Validates CRUD operations |
| Checks response format | Checks data accuracy |
| Tests application code | Tests stored procedures, triggers |

---

## Types of Database Testing

### 1. Structural Testing

Validates the database schema and structure.

**What to Test:**

**Schema Validation:**
- ✅ All required tables exist
- ✅ Column data types correct
- ✅ Constraints defined (NOT NULL, UNIQUE, CHECK)
- ✅ Primary keys defined
- ✅ Foreign keys configured correctly
- ✅ Indexes created for performance
- ✅ Default values set appropriately

**Example: Schema Test (PostgreSQL)**

```sql
-- Test: Verify users table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Expected:
-- id         | integer  | NO  | nextval('users_id_seq')
-- email      | varchar  | NO  | NULL
-- name       | varchar  | NO  | NULL
-- created_at | timestamp| NO  | CURRENT_TIMESTAMP
-- updated_at | timestamp| NO  | CURRENT_TIMESTAMP
```

**Example: Test with Python**

```python
import psycopg2
import pytest

@pytest.fixture
def db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="testdb",
        user="testuser",
        password="testpass"
    )
    yield conn
    conn.close()

def test_users_table_structure(db_connection):
    """Test that users table has correct structure"""
    cursor = db_connection.cursor()

    cursor.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
    """)

    columns = cursor.fetchall()

    expected = [
        ('id', 'integer', 'NO'),
        ('email', 'character varying', 'NO'),
        ('name', 'character varying', 'NO'),
        ('created_at', 'timestamp without time zone', 'NO'),
        ('updated_at', 'timestamp without time zone', 'NO')
    ]

    assert columns == expected, f"Schema mismatch: {columns}"

def test_foreign_key_constraints(db_connection):
    """Test that foreign keys are properly configured"""
    cursor = db_connection.cursor()

    cursor.execute("""
        SELECT
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'orders'
    """)

    foreign_keys = cursor.fetchall()

    # Verify orders.user_id references users.id
    assert ('orders', 'user_id', 'users', 'id') in foreign_keys
```

**Testing Indexes:**

```python
def test_required_indexes_exist(db_connection):
    """Ensure performance-critical indexes exist"""
    cursor = db_connection.cursor()

    cursor.execute("""
        SELECT indexname, tablename
        FROM pg_indexes
        WHERE tablename IN ('users', 'orders', 'products')
    """)

    indexes = cursor.fetchall()
    index_names = [idx[0] for idx in indexes]

    # Critical indexes that must exist
    required_indexes = [
        'users_email_idx',
        'users_created_at_idx',
        'orders_user_id_idx',
        'orders_status_idx',
        'products_category_id_idx'
    ]

    for idx in required_indexes:
        assert idx in index_names, f"Missing index: {idx}"
```

---

### 2. Functional Testing

Tests database operations and business logic.

**CRUD Operations Testing:**

```python
class TestUserCRUD:
    """Test Create, Read, Update, Delete operations"""

    def test_create_user(self, db_connection):
        """Test inserting a new user"""
        cursor = db_connection.cursor()

        # Create
        cursor.execute("""
            INSERT INTO users (email, name, password_hash)
            VALUES (%s, %s, %s)
            RETURNING id
        """, ('test@example.com', 'Test User', 'hashed_pw'))

        user_id = cursor.fetchone()[0]
        db_connection.commit()

        # Verify
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        assert user is not None
        assert user[1] == 'test@example.com'  # email
        assert user[2] == 'Test User'         # name

    def test_read_user(self, db_connection):
        """Test retrieving a user"""
        cursor = db_connection.cursor()

        cursor.execute("SELECT * FROM users WHERE email = %s",
                      ('test@example.com',))
        user = cursor.fetchone()

        assert user is not None
        assert user[2] == 'Test User'

    def test_update_user(self, db_connection):
        """Test updating user data"""
        cursor = db_connection.cursor()

        # Update
        cursor.execute("""
            UPDATE users
            SET name = %s, updated_at = CURRENT_TIMESTAMP
            WHERE email = %s
        """, ('Updated Name', 'test@example.com'))

        db_connection.commit()

        # Verify
        cursor.execute("SELECT name FROM users WHERE email = %s",
                      ('test@example.com',))
        name = cursor.fetchone()[0]

        assert name == 'Updated Name'

    def test_delete_user(self, db_connection):
        """Test deleting a user"""
        cursor = db_connection.cursor()

        # Delete
        cursor.execute("DELETE FROM users WHERE email = %s",
                      ('test@example.com',))
        db_connection.commit()

        # Verify deletion
        cursor.execute("SELECT * FROM users WHERE email = %s",
                      ('test@example.com',))
        user = cursor.fetchone()

        assert user is None
```

**Testing Stored Procedures:**

```sql
-- Stored procedure: Transfer money between accounts
CREATE OR REPLACE FUNCTION transfer_money(
    sender_id INT,
    receiver_id INT,
    amount DECIMAL
) RETURNS BOOLEAN AS $$
BEGIN
    -- Check sender balance
    IF (SELECT balance FROM accounts WHERE id = sender_id) < amount THEN
        RETURN FALSE;
    END IF;

    -- Deduct from sender
    UPDATE accounts SET balance = balance - amount WHERE id = sender_id;

    -- Add to receiver
    UPDATE accounts SET balance = balance + amount WHERE id = receiver_id;

    -- Log transaction
    INSERT INTO transactions (from_account, to_account, amount, timestamp)
    VALUES (sender_id, receiver_id, amount, CURRENT_TIMESTAMP);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

```python
def test_transfer_money_success(db_connection):
    """Test successful money transfer"""
    cursor = db_connection.cursor()

    # Setup: Create two accounts
    cursor.execute("INSERT INTO accounts (id, balance) VALUES (1, 1000)")
    cursor.execute("INSERT INTO accounts (id, balance) VALUES (2, 500)")
    db_connection.commit()

    # Execute transfer
    cursor.execute("SELECT transfer_money(1, 2, 200)")
    result = cursor.fetchone()[0]
    db_connection.commit()

    assert result is True

    # Verify balances
    cursor.execute("SELECT balance FROM accounts WHERE id = 1")
    assert cursor.fetchone()[0] == 800  # 1000 - 200

    cursor.execute("SELECT balance FROM accounts WHERE id = 2")
    assert cursor.fetchone()[0] == 700  # 500 + 200

    # Verify transaction logged
    cursor.execute("SELECT COUNT(*) FROM transactions WHERE from_account = 1")
    assert cursor.fetchone()[0] == 1

def test_transfer_money_insufficient_funds(db_connection):
    """Test transfer fails with insufficient funds"""
    cursor = db_connection.cursor()

    # Setup: Account with low balance
    cursor.execute("INSERT INTO accounts (id, balance) VALUES (3, 50)")
    cursor.execute("INSERT INTO accounts (id, balance) VALUES (4, 100)")
    db_connection.commit()

    # Attempt transfer (should fail)
    cursor.execute("SELECT transfer_money(3, 4, 100)")
    result = cursor.fetchone()[0]

    assert result is False

    # Verify no changes
    cursor.execute("SELECT balance FROM accounts WHERE id = 3")
    assert cursor.fetchone()[0] == 50  # Unchanged
```

**Testing Triggers:**

```sql
-- Trigger: Update product stock after order
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_placed
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_stock_after_order();
```

```python
def test_stock_updated_after_order(db_connection):
    """Test trigger updates stock when order placed"""
    cursor = db_connection.cursor()

    # Setup: Product with stock
    cursor.execute("INSERT INTO products (id, name, stock) VALUES (1, 'Widget', 100)")
    db_connection.commit()

    initial_stock = 100
    order_quantity = 5

    # Place order (trigger should fire)
    cursor.execute("""
        INSERT INTO order_items (order_id, product_id, quantity)
        VALUES (1, 1, %s)
    """, (order_quantity,))
    db_connection.commit()

    # Verify stock reduced
    cursor.execute("SELECT stock FROM products WHERE id = 1")
    current_stock = cursor.fetchone()[0]

    assert current_stock == initial_stock - order_quantity
```

---

### 3. Data Integrity Testing

Ensures data remains accurate and consistent.

**Constraint Testing:**

```python
class TestDataConstraints:
    """Test database constraints"""

    def test_unique_constraint(self, db_connection):
        """Test UNIQUE constraint prevents duplicates"""
        cursor = db_connection.cursor()

        # Insert first user
        cursor.execute("""
            INSERT INTO users (email, name, password_hash)
            VALUES ('duplicate@test.com', 'User 1', 'hash')
        """)
        db_connection.commit()

        # Attempt duplicate email (should fail)
        with pytest.raises(psycopg2.IntegrityError):
            cursor.execute("""
                INSERT INTO users (email, name, password_hash)
                VALUES ('duplicate@test.com', 'User 2', 'hash')
            """)
            db_connection.commit()

    def test_not_null_constraint(self, db_connection):
        """Test NOT NULL constraint"""
        cursor = db_connection.cursor()

        # Attempt to insert NULL email (should fail)
        with pytest.raises(psycopg2.IntegrityError):
            cursor.execute("""
                INSERT INTO users (email, name, password_hash)
                VALUES (NULL, 'User', 'hash')
            """)
            db_connection.commit()

    def test_check_constraint(self, db_connection):
        """Test CHECK constraint"""
        cursor = db_connection.cursor()

        # Assuming: CHECK (age >= 18)
        with pytest.raises(psycopg2.IntegrityError):
            cursor.execute("""
                INSERT INTO users (email, name, password_hash, age)
                VALUES ('kid@test.com', 'Kid', 'hash', 16)
            """)
            db_connection.commit()

    def test_foreign_key_constraint(self, db_connection):
        """Test foreign key prevents orphaned records"""
        cursor = db_connection.cursor()

        # Attempt to create order for non-existent user
        with pytest.raises(psycopg2.IntegrityError):
            cursor.execute("""
                INSERT INTO orders (user_id, total, status)
                VALUES (99999, 100.00, 'pending')
            """)
            db_connection.commit()
```

**Referential Integrity:**

```python
def test_cascade_delete(self, db_connection):
    """Test CASCADE DELETE removes related records"""
    cursor = db_connection.cursor()

    # Create user and orders
    cursor.execute("""
        INSERT INTO users (id, email, name, password_hash)
        VALUES (100, 'cascade@test.com', 'User', 'hash')
    """)
    cursor.execute("""
        INSERT INTO orders (id, user_id, total, status)
        VALUES (1, 100, 50.00, 'pending'),
               (2, 100, 75.00, 'shipped')
    """)
    db_connection.commit()

    # Delete user (should cascade to orders if configured)
    cursor.execute("DELETE FROM users WHERE id = 100")
    db_connection.commit()

    # Verify orders also deleted
    cursor.execute("SELECT COUNT(*) FROM orders WHERE user_id = 100")
    count = cursor.fetchone()[0]

    assert count == 0, "Orders should be deleted with user"
```

**Data Validation:**

```python
def test_data_format_validation(self, db_connection):
    """Test data formats are validated"""
    cursor = db_connection.cursor()

    test_cases = [
        # Valid emails
        ('valid@example.com', True),
        ('user+tag@domain.co.uk', True),

        # Invalid emails
        ('notanemail', False),
        ('missing@domain', False),
        ('@nodomain.com', False),
    ]

    for email, should_succeed in test_cases:
        if should_succeed:
            cursor.execute("""
                INSERT INTO users (email, name, password_hash)
                VALUES (%s, 'Test', 'hash')
            """, (email,))
            db_connection.commit()
        else:
            with pytest.raises(psycopg2.IntegrityError):
                cursor.execute("""
                    INSERT INTO users (email, name, password_hash)
                    VALUES (%s, 'Test', 'hash')
                """, (email,))
                db_connection.commit()
```

---

### 4. Performance Testing

Tests query speed and database scalability.

**Query Performance Testing:**

```python
import time

def test_query_performance(db_connection):
    """Test critical queries meet performance SLA"""
    cursor = db_connection.cursor()

    # Test: Get user orders (should complete in < 100ms)
    start = time.time()

    cursor.execute("""
        SELECT o.id, o.total, o.status, u.name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE u.id = %s
        ORDER BY o.created_at DESC
        LIMIT 20
    """, (1,))

    results = cursor.fetchall()
    duration = (time.time() - start) * 1000  # Convert to ms

    assert duration < 100, f"Query too slow: {duration}ms"
    assert len(results) > 0

def test_index_usage(db_connection):
    """Test that queries use indexes (not full table scan)"""
    cursor = db_connection.cursor()

    # Use EXPLAIN to check query plan
    cursor.execute("""
        EXPLAIN (FORMAT JSON)
        SELECT * FROM users WHERE email = 'test@example.com'
    """)

    plan = cursor.fetchone()[0][0]

    # Verify index scan (not sequential scan)
    plan_str = str(plan)
    assert 'Index Scan' in plan_str or 'Bitmap Index Scan' in plan_str
    assert 'Seq Scan' not in plan_str, "Query using full table scan!"
```

**Load Testing:**

```python
import concurrent.futures

def test_concurrent_writes(db_connection):
    """Test database handles concurrent transactions"""

    def insert_order(thread_id):
        conn = psycopg2.connect(
            host="localhost",
            database="testdb",
            user="testuser",
            password="testpass"
        )
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO orders (user_id, total, status)
            VALUES (%s, %s, 'pending')
        """, (thread_id, 100.00))

        conn.commit()
        conn.close()

    # Run 100 concurrent inserts
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(insert_order, i) for i in range(100)]
        concurrent.futures.wait(futures)

    # Verify all inserts succeeded
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'pending'")
    count = cursor.fetchone()[0]

    assert count == 100, f"Expected 100 orders, found {count}"
```

**N+1 Query Problem Detection:**

```python
def test_no_n_plus_one_queries(db_connection):
    """Detect and prevent N+1 query problems"""
    cursor = db_connection.cursor()

    # Enable query logging
    query_count = []

    original_execute = cursor.execute
    def counting_execute(*args, **kwargs):
        query_count.append(args[0])
        return original_execute(*args, **kwargs)

    cursor.execute = counting_execute

    # Fetch users with their orders (should use JOIN, not N+1)
    cursor.execute("""
        SELECT u.id, u.name, o.id, o.total
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id
        LIMIT 10
    """)

    results = cursor.fetchall()

    # Should be exactly 1 query (not 1 + N)
    assert len(query_count) == 1, f"N+1 query detected: {len(query_count)} queries"
```

---

### 5. Security Testing

Tests database against security vulnerabilities.

**SQL Injection Testing:**

```python
def test_sql_injection_prevention(db_connection):
    """Test that parameterized queries prevent SQL injection"""
    cursor = db_connection.cursor()

    # Malicious input attempting SQL injection
    malicious_email = "test@example.com' OR '1'='1"

    # Safe: Parameterized query
    cursor.execute("""
        SELECT * FROM users WHERE email = %s
    """, (malicious_email,))

    results = cursor.fetchall()

    # Should return 0 results (injection failed)
    assert len(results) == 0

def test_sql_injection_in_like_clause(db_connection):
    """Test SQL injection prevention in LIKE clauses"""
    cursor = db_connection.cursor()

    # Malicious LIKE input
    malicious_search = "%'; DROP TABLE users; --"

    # Safe: Parameterized query with LIKE
    cursor.execute("""
        SELECT * FROM users WHERE name LIKE %s
    """, (f'%{malicious_search}%',))

    results = cursor.fetchall()

    # Verify users table still exists
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]

    assert count >= 0, "Table should still exist"
```

**Access Control Testing:**

```python
def test_user_permissions(db_connection):
    """Test database user has only necessary permissions"""
    cursor = db_connection.cursor()

    # App user should NOT be able to drop tables
    with pytest.raises(psycopg2.ProgrammingError):
        cursor.execute("DROP TABLE users")

    # App user should NOT be able to create users
    with pytest.raises(psycopg2.ProgrammingError):
        cursor.execute("CREATE USER hacker WITH PASSWORD 'password'")

def test_sensitive_data_encryption(db_connection):
    """Test sensitive data is encrypted"""
    cursor = db_connection.cursor()

    # Insert user with SSN
    cursor.execute("""
        INSERT INTO users (email, name, ssn_encrypted)
        VALUES ('test@example.com', 'Test', pgp_sym_encrypt('123-45-6789', 'secret_key'))
    """)
    db_connection.commit()

    # Retrieve raw SSN (should be encrypted)
    cursor.execute("SELECT ssn_encrypted FROM users WHERE email = 'test@example.com'")
    encrypted = cursor.fetchone()[0]

    # Verify it's encrypted (not plain text)
    assert encrypted != '123-45-6789'
    assert encrypted != b'123-45-6789'

    # Decrypt to verify
    cursor.execute("""
        SELECT pgp_sym_decrypt(ssn_encrypted::bytea, 'secret_key')
        FROM users WHERE email = 'test@example.com'
    """)
    decrypted = cursor.fetchone()[0].decode()

    assert decrypted == '123-45-6789'
```

---

## Database Testing Best Practices

### 1. Test Data Management

**Use Test Database:**
```python
# Never run tests on production!
@pytest.fixture(scope='session')
def test_db():
    """Create isolated test database"""
    conn = psycopg2.connect(
        host="localhost",
        database="test_db",  # Separate test DB
        user="test_user",
        password="test_pass"
    )
    yield conn
    conn.close()
```

**Database Fixtures:**
```python
@pytest.fixture(autouse=True)
def reset_database(db_connection):
    """Reset database before each test"""
    cursor = db_connection.cursor()

    # Truncate all tables
    cursor.execute("""
        TRUNCATE TABLE orders, users, products
        RESTART IDENTITY CASCADE
    """)

    db_connection.commit()

    yield  # Run test

    # Cleanup after test
    db_connection.rollback()
```

**Seed Test Data:**
```python
@pytest.fixture
def seed_users(db_connection):
    """Insert test users"""
    cursor = db_connection.cursor()

    test_users = [
        ('user1@test.com', 'User One', 'hash1'),
        ('user2@test.com', 'User Two', 'hash2'),
        ('user3@test.com', 'User Three', 'hash3'),
    ]

    cursor.executemany("""
        INSERT INTO users (email, name, password_hash)
        VALUES (%s, %s, %s)
    """, test_users)

    db_connection.commit()
```

### 2. Transaction Management

**Use Transactions in Tests:**
```python
def test_with_transaction(db_connection):
    """Wrap test in transaction for isolation"""
    cursor = db_connection.cursor()

    try:
        # Test operations
        cursor.execute("INSERT INTO users ...")
        cursor.execute("UPDATE orders ...")

        # Assertions
        assert something

        # Rollback (don't commit test data)
        db_connection.rollback()
    except Exception:
        db_connection.rollback()
        raise
```

### 3. Testing Migrations

**Test Migration Scripts:**
```python
def test_migration_001_create_users_table():
    """Test migration creates users table"""
    # Apply migration
    run_migration('001_create_users.sql')

    # Verify table exists
    cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_name = 'users'
    """)

    assert cursor.fetchone() is not None

def test_migration_002_adds_email_column():
    """Test migration adds email column"""
    # Apply previous migrations
    run_migration('001_create_users.sql')

    # Apply this migration
    run_migration('002_add_email_column.sql')

    # Verify column exists
    cursor.execute("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'email'
    """)

    assert cursor.fetchone() is not None

def test_migration_rollback():
    """Test migration can be rolled back"""
    # Apply migration
    run_migration('003_add_index.sql')

    # Rollback
    run_migration('003_add_index_down.sql')

    # Verify index removed
    cursor.execute("""
        SELECT indexname
        FROM pg_indexes
        WHERE indexname = 'users_email_idx'
    """)

    assert cursor.fetchone() is None
```

---

## Common Database Testing Mistakes

### Mistake 1: Testing on Production Database
**Problem:** Tests modify or delete production data

**Fix:** Always use separate test database

### Mistake 2: Not Cleaning Up Test Data
**Problem:** Tests pollute database, subsequent tests fail

**Fix:** Use transactions, reset database between tests

### Mistake 3: Ignoring Performance
**Problem:** Queries work but slow at scale

**Fix:** Test with realistic data volumes, monitor query plans

### Mistake 4: Hardcoded Test Data
**Problem:** Tests depend on specific IDs, break when data changes

**Fix:** Use fixtures, generate test data dynamically

### Mistake 5: Not Testing Edge Cases
**Problem:** Database handles normal data but fails on nulls, unicode, large text

**Fix:** Test boundary conditions, special characters, NULL values

---

## What Senior Engineers Know

**Test with production-like data volumes.** Queries that work with 100 rows fail with 1 million. Load test data at scale.

**Indexes are critical for performance.** Without indexes, queries do full table scans. Monitor with EXPLAIN plans.

**Transactions prevent race conditions.** Use SERIALIZABLE isolation for critical operations like inventory or payments.

**Database migrations are risky.** Test them thoroughly on staging with production data. Have rollback plan.

**Connection pools prevent bottlenecks.** Application should reuse connections, not create new ones for every query.

---

## Exercise

**Test a User Management System:**

Given this schema:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_login ON users(last_login);
```

**Your Tasks:**

1. Write structural tests to verify schema correctness
2. Write CRUD operation tests
3. Write constraint tests (unique email, NOT NULL)
4. Write performance test (email lookup < 50ms)
5. Write SQL injection prevention test

**Deliverable:** Python test file with at least 10 test cases.

---

## Next Steps

- Learn [Microservices Testing](04-microservices-testing.md) for distributed data
- Master [CI/CD Quality Gates](05-cicd-quality-gates.md) for automated database tests
- Study [Test Data Management](08-test-data-management.md) for complex scenarios
