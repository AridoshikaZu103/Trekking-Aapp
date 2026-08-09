## Summary

This PR adds project infrastructure and documentation enhancements for the Trekking Management App V1.

## Changes

### CI/CD Pipeline (Closes #1)
- Added `.github/workflows/ci.yml` with:
  - Python 3.12 setup
  - flake8 linting
  - Flask app import verification
  - Database init + admin seeding test
  - API smoke tests (GET /, GET /api/treks, POST /login)

### .gitignore (Closes #2)
- Excludes `__pycache__/`, `.vscode/`, `Project_Report.pdf`, `instance/`, `*.db`, virtual envs

### README Enhancement (Closes #3)
- Full documentation with tech stack, DB schema, ER diagram, CRUD matrix, REST API docs with JSON examples, security notes, troubleshooting guide
- Demo video embedded from `Video/Project_Video.mp4`

### Vercel Deployment (Closes #4)
- Added `vercel.json` with `@vercel/python` builder

## Testing
- CI workflow passes all checks
- App runs locally with `python app.py`
