# ai-resume

## Environment variables

Create a `.env.local` file for local development:

```bash
GEMINI_API_KEY=your_gemini_api_key
# Optional: defaults to gemini-2.5-flash
GEMINI_MODEL=gemini-2.5-flash

# Supabase Auth (for /sign-in and /register)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- `GEMINI_API_KEY` is required by `POST /api/analyze`.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for client-side email/password auth on `/sign-in` and `/register` via Supabase Auth.
- If `GEMINI_API_KEY` is missing, the route returns HTTP `500` with a safe configuration error message.

## API: `POST /api/analyze`

Analyzes normalized resume text and returns structured scoring feedback. The `overallScore` is always an integer from 0 to 100.

### Request JSON

```json
{
  "normalizedResumeText": "string (required, 200..20000 chars)",
  "jobTarget": "string (optional, 2..500 chars)"
}
```

### Success response (`200`)

```json
{
  "overallScore": 82,
  "strengths": ["Strong quantified impact bullets"],
  "weaknesses": ["Missing clear technical summary"],
  "suggestions": ["Add role-specific keyword variants"],
  "keywordGaps": ["Kubernetes", "System Design"]
}
```

### Error responses

- `400` invalid JSON body or upstream rejects bad input payload.
- `422` schema validation errors.
- `429` Gemini/API rate limit.
- `500` missing server configuration or unexpected server exception.
- `502` malformed or empty upstream AI response.
- `504` upstream AI timeout.
