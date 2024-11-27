from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from ..models import Document  # Ensure this is the SQLAlchemy model
from ..schemas import Document as DocumentSchema, DocumentCreate, DocumentsResponse
from ..database import SessionLocal

router = APIRouter()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get all documents with pagination, optional search, and sorting
@router.get("/api/documents", response_model=DocumentsResponse)
def get_documents(
    db: Session = Depends(get_db),
    search: str = None,
    sort_by: str = 'created_at',  # default sorting field
    sort_order: str = 'asc',      # default sorting order
    page: int = 1,                # default page number
    page_size: int = 5           # default number of documents per page
):
    # Calculate offset and limit for pagination
    offset = (page - 1) * page_size
    limit = page_size

    query = db.query(Document)  # Use the SQLAlchemy model, not the Pydantic schema

    # Apply search if a search term is provided
    if search:
        query = query.filter(Document.name.contains(search))
    
    # Sorting logic based on `sort_by` and `sort_order`
    if sort_by == 'name':
        if sort_order == 'asc':
            query = query.order_by(Document.name.asc())
        else:
            query = query.order_by(Document.name.desc())
    elif sort_by == 'created_at':
        if sort_order == 'asc':
            query = query.order_by(Document.created_at.asc())
        else:
            query = query.order_by(Document.created_at.desc())
    elif sort_by == 'size':
        if sort_order == 'asc':
            query = query.order_by(Document.size.asc())
        else:
            query = query.order_by(Document.size.desc())
    
    # Apply pagination to the query
    documents = query.offset(offset).limit(limit).all()

    # Get the total count of documents
    total = db.query(Document).filter(Document.name.contains(search) if search else True).count()
    
    # Return both documents and total count
    return {"documents": documents, "total": total}

# Get a single document by ID
@router.get("/api/documents/{id}", response_model=DocumentSchema)
def get_document(id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

# Create a new document
@router.post("/api/documents", response_model=DocumentSchema)
def create_document(doc: DocumentCreate, db: Session = Depends(get_db)):
    new_doc = Document(
        name=doc.name,
        content=doc.content,
        size=len(doc.content),
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

# Delete a document by ID
@router.delete("/api/documents/{id}")
def delete_document(id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(document)
    db.commit()
    return {"message": "Document deleted successfully"}
