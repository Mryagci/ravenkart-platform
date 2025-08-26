# Supabase Keys Alma Rehberi

## 1. Supabase Dashboard'a Git
- https://supabase.com/dashboard
- Projen: `atozlshaxxxfgkclvjdd`

## 2. API Keys Sayfasına Git
- Sol menüden "Settings" > "API" seç

## 3. Gerekli Keys
### Service Role Key (Secret) 
- **Bu key'i kopyala** - `service_role` key'i
- **ÇOK ÖNEMLİ:** Bu key RLS'i bypass eder, çok gizli!

### Anon Key (Public)
- Zaten mevcut: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 4. .env.local'e Ekle
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0b3psc2hheHh4ZmdrY2x2amRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgwMTA4OSwiZXhwIjoyMDcxMzc3MDg5fQ.ACTUAL_SERVICE_ROLE_KEY_HERE
```

## 5. Test Et
```bash
node -e "
const jwt = require('jsonwebtoken');
const decoded = jwt.decode(process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('Role:', decoded.role);
console.log('Valid:', decoded.role === 'service_role');
"
```