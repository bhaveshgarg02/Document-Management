from fastapi import FastAPI
from .routers import documents
from .database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from .models import Base
from sqlalchemy.orm import Session


app = FastAPI()

# CORS configuration to allow frontend access
origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.on_event("startup")
def on_startup():
   
    Base.metadata.create_all(bind=engine)

app.include_router(documents.router)

