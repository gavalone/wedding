from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.invite import router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://wedding-silk-two.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router,
    prefix="/api"
)
