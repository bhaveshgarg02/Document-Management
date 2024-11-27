from pydantic import BaseModel
from datetime import datetime
from typing import List

class DocumentCreate(BaseModel):
    name: str
    content: str

    class Config:
        orm_mode = True

class Document(DocumentCreate):
    id: int
    created_at: datetime
    size: int

    class Config:
        orm_mode = True

class DocumentsResponse(BaseModel):
    documents: List[Document]  
    total: int  

    class Config:
        orm_mode = True
