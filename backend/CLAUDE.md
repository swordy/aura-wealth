# Backend — Conventions & Patterns

## Auth Middleware

### JWT Flow
- **Login**: POST `/api/v1/auth/login` → returns `{ access_token, refresh_token, token_type }`
- **Register**: POST `/api/v1/auth/register` → creates user + seeds 5 patrimoine documents
- **Refresh**: POST `/api/v1/auth/refresh` → rotates access token
- **Tokens**: python-jose (HS256), access=30min, refresh=7d
- **Passwords**: passlib[bcrypt], never stored plain text

### `get_current_user` Dependency
```python
async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    # Decode JWT, fetch user from DB, return UserInDB
    # ALL protected routes use: user = Depends(get_current_user)
```
- `user.id` is the ONLY source of `user_id` for DB queries
- NEVER accept `user_id` from request body or query params

## User Data Isolation

### Query Pattern
```python
# CORRECT — always filter by user_id from JWT
doc = await db.patrimoine_data.find_one({"user_id": user.id, "domain": "dashboard"})

# WRONG — never trust client-supplied IDs
doc = await db.patrimoine_data.find_one({"user_id": request.user_id})
```

### Seed Pattern
- `seed_if_empty(db)` called during app lifespan startup
- Creates demo user (demo@aura.fr / demo1234) if `users` collection is empty
- Inserts 5 patrimoine_data documents (one per domain) linked to demo user

## CRUD Pattern (S6+)

### Endpoints per Domain
```
GET    /api/v1/{domain}              → full domain data (read)
PUT    /api/v1/{domain}              → replace entire domain data
PATCH  /api/v1/{domain}              → partial update (field-level)
POST   /api/v1/{domain}/reset        → reset to default mock values
```

### Write Flow
1. Router receives request, validates with Pydantic model
2. Router calls `services/patrimoine.py` (NEVER writes directly to DB)
3. Service updates patrimoine_data + writes audit_log entry
4. Service triggers `services/recalcul.py` for derived fields
5. Returns updated data

### Audit Trail
Every write operation logs to `audit_log`:
```python
{
    "user_id": user.id,
    "action": "update" | "reset" | "delete",
    "domain": "dashboard" | "epargne" | "bourse" | "immobilier" | "private_equity",
    "field": "fiscal.ir",           # dot-notation path
    "old_value": 12500,
    "new_value": 13000,
    "source": "manual" | "document" | "reset",
    "timestamp": datetime.utcnow()
}
```

## Recalcul Service (S8+)

When a value changes, derived fields must be recalculated:
- `patrimoine_brut` = sum of all asset values
- `patrimoine_net` = patrimoine_brut - total CRD
- `taux_endettement` = total CRD / revenus bruts
- `capacite_residuelle` = (revenus × 0.35) - mensualites
- `cashflow_net_mensuel` = revenus_locatifs_mensuels - mensualites_credits
- `fiscal.total_annuel` = ir + ps + tf
- `fiscal.taux_effectif` = total_annuel / revenus_bruts × 100
- `score_diversification` recalculated from repartition percentages

Recalcul is triggered after every PATCH/PUT, never manually by frontend.

## Response Format

### Pydantic Base Model
```python
from pydantic import BaseModel
from pydantic.alias_generators import to_camel

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
```
All domain models inherit from `CamelModel` → JSON output is camelCase.

### CamelCase Pitfall
`to_camel` capitalizes after EVERY underscore, including after digits:
- `projection_10ans` → `projection10Ans` (capital A)
- `economie_per_10k` → `economiePer10K` (capital K)
- **Rule**: Always verify camelCase output for fields containing numbers.

### Error Responses
```python
from fastapi import HTTPException

raise HTTPException(status_code=404, detail="Données introuvables")
raise HTTPException(status_code=403, detail="Accès interdit")
raise HTTPException(status_code=422, detail="Valeur invalide pour le champ X")
```

## Validation Rules
- All monetary values: `float`, `>= 0` (except cashflow which can be negative)
- Percentages: `float`, `0–100`
- TMI: `Literal[0, 11, 30, 41, 45]`
- Dates: ISO 8601 strings
- Email: Pydantic `EmailStr`
- Passwords: min 8 chars

## Document Parsing (S7+)

### Upload Flow
1. Frontend sends `multipart/form-data` to `POST /api/v1/documents/upload`
2. Backend validates file type (PDF, CSV, XLS/XLSX), max 10MB
3. Saves to `/data/uploads/{user_id}/{uuid}_{filename}`
4. Inserts `documents` record with `status: "uploaded"`
5. Returns `{ document_id, preview: ParsedValues }`

### Parsers (`services/parsers/`)
- `csv_parser.py` — Bank statement CSV (separator auto-detect)
- `pdf_parser.py` — Insurance/tax documents via pdfplumber
- `xlsx_parser.py` — Excel bilans via openpyxl
- Each parser returns `ParsedValues` dict matching patrimoine fields

### Integration Flow
1. `POST /api/v1/documents/{id}/integrate` with `confirmed_values`
2. Service merges values into patrimoine_data
3. Writes audit_log with `source: "document"`
4. Updates document `status: "integrated"`

## File Storage
- Volume-mounted at `/data/uploads/`
- Path pattern: `/data/uploads/{user_id}/{uuid}_{original_filename}`
- Cleanup: files deleted when document record is deleted
- Max file size: 10MB
- Allowed types: `.pdf`, `.csv`, `.xls`, `.xlsx`

## Testing
```bash
python -m pytest                    # All tests
python -m pytest tests/test_routers.py  # Router tests only
python -m pytest -k "test_dashboard"    # Specific test
```
- Test with 2 different users to verify data isolation
- Mock MongoDB with `mongomock` or test against Docker mongo
