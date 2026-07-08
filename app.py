"""Railway entrypoint — serves API + built frontend static files."""
import os
import sys
from pathlib import Path

# Ensure backend is importable
sys.path.insert(0, str(Path(__file__).parent / "backend"))

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, users, orders, services, wallet, support, admin_routes, notifications
from security.middleware import RateLimiter

app = FastAPI(title="Phone Unlock Pro API", version="1.0.0", docs_url="/docs", redoc_url=None)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.middleware("http")(RateLimiter())

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(services.router)
app.include_router(wallet.router)
app.include_router(support.router)
app.include_router(admin_routes.router)
app.include_router(notifications.router)

@app.get("/health")
def health():
    return {"status": "ok"}

# Debug: dump filesystem layout
import logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("startup")
cwd = os.getcwd()
file_path = __file__
log.info("CWD=%s __file__=%s frontend_dir=%s exists=%s", cwd, file_path,
         str(Path(__file__).parent / "frontend" / "out"),
         (Path(__file__).parent / "frontend" / "out").exists())
# Also check alt paths
for alt in ["frontend/out", "out"]:
    p = Path(cwd) / alt
    log.info("  alt=%s exists=%s", str(p), p.exists())

# Try parent of CWD
for alt in ["frontend/out", "out"]:
    p = Path(cwd).parent / alt
    log.info("  parent_alt=%s exists=%s", str(p), p.exists())

# Serve built frontend — must be LAST (mount at / catches everything)
frontend_dir = Path(__file__).parent / "frontend" / "out"
if frontend_dir.exists():
    log.info("Mounting frontend static files from %s", str(frontend_dir))
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
else:
    log.warning("frontend static dir NOT FOUND at %s", str(frontend_dir))
    # Fallback: try from CWD
    alt = Path(cwd) / "frontend" / "out"
    if alt.exists():
        log.info("Fallback: mounting from %s", str(alt))
        app.mount("/", StaticFiles(directory=str(alt), html=True), name="frontend")
