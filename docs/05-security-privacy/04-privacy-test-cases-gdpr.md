# Privacy Test Cases (GDPR)

## GDPR Principles

```
1. Lawfulness, Fairness, Transparency
2. Purpose Limitation
3. Data Minimization
4. Accuracy
5. Storage Limitation
6. Integrity and Confidentiality
7. Accountability
```

---

## Right to Access (Article 15)

**Test: User Can Download Their Data**
```javascript
describe('GDPR - Right to Access', () => {
  it('should provide user data export', async () => {
    const response = await request(app)
      .get('/api/gdpr/export')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.headers['content-type']).toBe('application/json');
    expect(response.body).toHaveProperty('personalData');
    expect(response.body.personalData).toHaveProperty('email');
    expect(response.body.personalData).toHaveProperty('profile');
    expect(response.body.personalData).toHaveProperty('orders');
  });
});
```

---

## Right to Erasure (Article 17)

**Test: User Can Delete Their Account**
```javascript
describe('GDPR - Right to Erasure', () => {
  it('should delete all user data when account deleted', async () => {
    const userId = 123;

    // Delete account
    await request(app)
      .delete('/api/account')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    // Verify data deleted from all tables
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    expect(user.length).toBe(0);

    const orders = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    expect(orders.length).toBe(0);

    const profile = await db.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    expect(profile.length).toBe(0);
  });

  it('should anonymize data that must be retained for legal reasons', async () => {
    // Financial transactions must be retained for 7 years
    const transaction = await db.query('SELECT * FROM transactions WHERE user_id = ?', [deletedUserId]);
    
    expect(transaction[0].user_id).toBeNull();  // Anonymized
    expect(transaction[0].email).toBeNull();  // Anonymized
    expect(transaction[0].amount).toBeDefined();  // Retained for compliance
  });
});
```

---

## Consent Management (Article 6)

**Test: Explicit Consent Required**
```javascript
describe('GDPR - Consent', () => {
  it('should require explicit consent for marketing emails', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        // No consent provided
      });

    // Account created, but marketing consent defaults to false
    const user = await db.query('SELECT marketing_consent FROM users WHERE email = ?', ['test@example.com']);
    expect(user[0].marketing_consent).toBe(false);
  });

  it('should honor consent withdrawal', async () => {
    // User withdraws consent
    await request(app)
      .patch('/api/consent')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ marketing_consent: false });

    // Verify no marketing emails sent after withdrawal
    const job = await getScheduledEmailJobs(userId);
    expect(job.marketing).toBeUndefined();
  });
});
```

---

## Data Portability (Article 20)

**Test: Data Export in Machine-Readable Format**
```javascript
it('should export data in JSON format', async () => {
  const response = await request(app)
    .get('/api/gdpr/export')
    .set('Authorization', `Bearer ${userToken}`)
    .expect(200);

  const data = response.body;
  
  // Verify structured, machine-readable format
  expect(data).toHaveProperty('personalData');
  expect(data).toHaveProperty('activityData');
  expect(data).toHaveProperty('exportDate');
  
  // Verify all personal data included
  expect(data.personalData).toEqual({
    email: 'user@example.com',
    name: 'John Doe',
    dateOfBirth: '1990-01-01',
    address: expect.any(Object),
  });
});
```

---

## Data Minimization

**Test: Only Necessary Data Collected**
```javascript
it('should not collect excessive data', async () => {
  const registrationFields = getRegistrationFormFields();
  
  // Only essential fields required
  expect(registrationFields.required).toEqual([
    'email',
    'password',
  ]);

  // Optional fields clearly marked
  expect(registrationFields.optional).toContain('phoneNumber');
  expect(registrationFields.optional).toContain('dateOfBirth');
});
```

---

## Privacy by Design

**Test: Default Settings Privacy-Friendly**
```javascript
it('should default to most privacy-preserving settings', async () => {
  const newUser = await createUser({ email: 'test@example.com' });
  
  const settings = await getPrivacySettings(newUser.id);
  
  expect(settings.profileVisibility).toBe('private');  // Not public by default
  expect(settings.dataSharing).toBe(false);  // No sharing by default
  expect(settings.thirdPartyTracking).toBe(false);  // No tracking by default
});
```

---

## Data Retention Policies

**Test: Automated Data Deletion After Retention Period**
```javascript
describe('Data Retention', () => {
  it('should delete old logs after retention period', async () => {
    // Retention policy: Delete logs older than 90 days
    const oldLog = await createLog({ createdAt: new Date('2024-01-01') });  // 1 year ago
    
    // Run retention cleanup job
    await runDataRetentionCleanup();
    
    const log = await db.query('SELECT * FROM logs WHERE id = ?', [oldLog.id]);
    expect(log.length).toBe(0);  // Deleted
  });

  it('should retain financial data for 7 years (compliance)', async () => {
    const oldTransaction = await createTransaction({ createdAt: new Date('2020-01-01') });  // 5 years ago
    
    await runDataRetentionCleanup();
    
    const transaction = await db.query('SELECT * FROM transactions WHERE id = ?', [oldTransaction.id]);
    expect(transaction.length).toBe(1);  // Still retained
  });
});
```

---

## Data Breach Notification

**Test: Breach Notification System**
```javascript
it('should notify users within 72 hours of data breach', async () => {
  // Simulate data breach detection
  await detectDataBreach({ affectedUsers: [123, 456], severity: 'high' });
  
  // Verify notification job scheduled
  const notification = await getScheduledNotification({ type: 'breach', userId: 123 });
  
  expect(notification).toBeDefined();
  expect(notification.scheduledTime).toBeLessThanOrEqual(Date.now() + 72 * 60 * 60 * 1000);
  
  // Verify regulatory authority notified
  const regulatoryNotification = await getRegulatoryNotification();
  expect(regulatoryNotification.authority).toBe('ICO');  // UK example
  expect(regulatoryNotification.status).toBe('sent');
});
```

---

## Children's Privacy (Article 8)

**Test: Parental Consent for Minors**
```javascript
it('should require parental consent for users under 16', async () => {
  const response = await request(app)
    .post('/api/register')
    .send({
      email: 'child@example.com',
      password: 'SecurePass123!',
      dateOfBirth: '2015-01-01',  // 10 years old
    });

  expect(response.status).toBe(400);
  expect(response.body.error).toContain('parental consent required');
});
```

---

## Exercise

**GDPR Compliance Audit:**

For your application:
1. Map all personal data collection points
2. Document lawful basis for each
3. Create test cases for all GDPR rights
4. Implement data retention policy
5. Test data export/deletion flows

**Deliverable:** GDPR compliance test suite.

---

## Next Steps

- Learn [Security Automation](05-security-automation.md)
- Study [Penetration Testing Basics](06-penetration-testing-basics.md)
