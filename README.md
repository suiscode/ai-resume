# ai-resume

## Environment variables

Create a `.env.local` file for local development:

```bash
OPENAI_API_KEY=your_openai_api_key
# Optional: defaults to gpt-4o-mini
OPENAI_MODEL=gpt-4o-mini
```

- `OPENAI_API_KEY` is required by `POST /api/analyze`.
- If `OPENAI_API_KEY` is missing, the route returns HTTP `500` with a safe configuration error message.

## API: `POST /api/analyze`

Analyzes normalized resume text and returns structured scoring feedback.

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
- `429` OpenAI/API rate limit.
- `500` missing server configuration or unexpected server exception.
- `502` malformed or empty upstream AI response.
- `504` upstream AI timeout.
