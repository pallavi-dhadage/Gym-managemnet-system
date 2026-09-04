import os
import uvicorn
from app.main import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"🚀 Starting GymForce FastAPI server on http://{host}:{port}")
    print(f"📖 Swagger Docs available at http://{host}:{port}/api/docs")
    uvicorn.run("main:app", host=host, port=port, reload=True)

