from pathlib import Path

folders = [
    "frontend/app",
    "frontend/components",
    "frontend/lib",
    "frontend/public",
    "frontend/styles",

    "backend/api/routes",
    "backend/agents",
    "backend/tools",
    "backend/services",
    "backend/models",
    "backend/schemas",
    "backend/database",
    "backend/utils",
    "backend/middleware",
    "backend/config",
    "backend/tests",

    "docs",
    ".github/workflows",
    "docker",
    "scripts"
]

files = [
    "README.md",
    ".gitignore",
    ".env.example",
    "LICENSE",

    "backend/main.py",
    "backend/requirements.txt",

    "docs/architecture.md",
    "docs/api_docs.md",
    "docs/setup_guide.md",

    ".github/workflows/backend-ci.yml",
    ".github/workflows/frontend-ci.yml",

    "docker/Dockerfile.backend",
    "docker/Dockerfile.frontend",
    "docker/docker-compose.yml",

    "scripts/run_backend.sh",
    "scripts/run_frontend.sh",

     "frontend/app/test.txt",
    "frontend/components/test.txt",
    "frontend/lib/test.txt",
    "frontend/public/test.txt",
    "frontend/styles/test.txt",

    "backend/api/routes/test.txt",
    "backend/agents/test.txt",
    "backend/tools/test.txt",
    "backend/services/test.txt",
    "backend/models/test.txt",
    "backend/schemas/test.txt",
    "backend/database/test.txt",
    "backend/utils/test.txt",
    "backend/middleware/test.txt",
    "backend/config/test.txt",
    "backend/tests/test.txt",

    "docs/test.txt",
    ".github/workflows/test.txt",
    "docker/test.txt",
    "scripts/test.txt"
]

for folder in folders:
    Path(folder).mkdir(parents=True, exist_ok=True)

for file in files:
    Path(file).touch(exist_ok=True)

print("✅ AI Travel Concierge structure created!")