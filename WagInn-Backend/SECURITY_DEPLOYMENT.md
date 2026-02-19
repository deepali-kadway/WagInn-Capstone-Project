# WagInn Security Implementation Deployment Checklist

## Pre-Deployment Preparation

### Environment Variables Setup

- [ ] Set strong `JWT_SECRET` (minimum 32 characters, cryptographically random)
- [ ] Configure `ALLOWED_ORIGINS` with production domains
- [ ] Verify `NODE_ENV=production` in production environment
- [ ] Test environment variable loading with `dotenv`

### Database Preparation

- [ ] Backup production database
- [ ] Test migration script on database copy
- [ ] Verify Host model schema changes in staging
- [ ] Create rollback plan for database changes

## Deployment Order (Follow Exactly)

### Step 1: CORS Security (Lowest Risk)

**Deploy:** Server CORS configuration changes

- [ ] Deploy backend with CORS restrictions
- [ ] Test frontend connectivity from allowed origins
- [ ] Verify CORS blocking works for unauthorized domains
- [ ] Monitor logs for blocked origin attempts

**Rollback Plan:** Revert CORS to `origin: true` if frontend breaks

### Step 2: JWT Secret Hardening (Medium Risk)

**Deploy:** JWT configuration and logging cleanup

- [ ] Verify strong JWT secret is set in environment
- [ ] Deploy JWT validation enhancements
- [ ] Test user/host authentication flows
- [ ] Verify sensitive data no longer appears in logs

**Rollback Plan:** Revert JWT secret validation if authentication breaks

### Step 3: Host Password Hashing (Highest Risk)

**Deploy:** Password hashing for new hosts + migration for existing

#### 3a. Deploy Code Changes

- [ ] Deploy host registration with password hashing
- [ ] Deploy host authentication with bcrypt comparison
- [ ] Verify new host registration works (create test host)
- [ ] Test legacy host login compatibility

#### 3b. Run Migration (Maintenance Window Recommended)

- [ ] Schedule maintenance window (15-30 minutes)
- [ ] Run migration script: `node scripts/migrateHostPasswords.js`
- [ ] Verify migration success (check processed count)
- [ ] Test existing host logins with new hashed passwords
- [ ] Remove legacy password fallback after 24h

**Rollback Plan:**

```bash
# Emergency rollback
node scripts/migrateHostPasswords.js rollback
```

## Testing Checklist

### Automated Tests (Run Before Deployment)

- [ ] User authentication flow (login/logout)
- [ ] Host authentication flow (login/logout)
- [ ] Booking creation with authentication
- [ ] CORS preflight requests
- [ ] JWT token expiration handling

### Manual Testing (Run After Each Step)

- [ ] Frontend app loads from production domain
- [ ] User can register and login
- [ ] Host can register and login
- [ ] Booking flow works end-to-end
- [ ] API responds correctly to invalid tokens
- [ ] Console logs show no sensitive data

### Monitoring Points

- [ ] Watch error rates during deployment
- [ ] Monitor CORS violation logs
- [ ] Check authentication failure rates
- [ ] Verify database connection stability
- [ ] Monitor response times for auth endpoints

## Security Verification

### Post-Deployment Security Checks

- [ ] No default JWT secrets in use (check startup logs)
- [ ] CORS only allows intended domains
- [ ] Host passwords are bcrypt hashed in database
- [ ] No plain text passwords in logs
- [ ] Authentication endpoints require valid tokens
- [ ] Rate limiting works (if implemented)

### Production Health Check

```bash
# Test CORS
curl -H "Origin: https://malicious-site.com" https://api.waginn.com/health
# Should return CORS error

# Test JWT requirement
curl https://api.waginn.com/api/bookings/user/123
# Should return 401 Unauthorized

# Test valid authentication
curl -H "Authorization: Bearer valid_jwt_token" https://api.waginn.com/api/bookings/user/123
# Should return user's bookings or 403 if wrong user
```

## Rollback Procedures

### Emergency Rollback (If Critical Issues)

1. **CORS Issues:** Set `ALLOWED_ORIGINS=*` temporarily
2. **JWT Issues:** Use weaker validation temporarily
3. **Password Issues:** Run migration rollback script
4. **Complete Rollback:** Deploy previous version

### Gradual Rollback Options

- Feature flags for each security enhancement
- Database rollback scripts for password migration
- Configuration rollback for CORS/JWT settings

## Communication Plan

### Before Deployment

- [ ] Notify hosts of potential brief login disruption
- [ ] Prepare support team for authentication questions
- [ ] Document troubleshooting steps

### During Issues

- [ ] Communication template for host login problems
- [ ] Escalation path for critical authentication failures
- [ ] Monitoring dashboard for real-time status

### Success Metrics

- [ ] No increase in authentication error rates
- [ ] CORS violations logged for unauthorized domains
- [ ] Password migration successful for >95% of hosts
- [ ] No sensitive data in production logs

---

## Quick Emergency Commands

```bash
# Check migration status
node scripts/migrateHostPasswords.js --dry-run

# Emergency password rollback
node scripts/migrateHostPasswords.js rollback

# Check JWT secret strength
node -e "console.log('JWT Secret length:', process.env.JWT_SECRET?.length || 'NOT SET')"

# View recent login attempts
tail -f /var/log/waginn/auth.log | grep -E "(login|authentication)"
```
