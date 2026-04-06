from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import crud, models, schemas
from database import get_db

router = APIRouter()

# Mock Auth Dependency
def get_current_user(x_user_id: Optional[int] = Header(None), db: Session = Depends(get_db)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-Id header missing")
    user = crud.get_user(db, x_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users", response_model=List[schemas.UserRead])
def get_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@router.get("/documents", response_model=List[schemas.DocumentRead])
def get_my_documents(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_documents_for_user(db, current_user.id)

@router.post("/documents", response_model=schemas.DocumentRead)
def create_document(doc: schemas.DocumentCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_document(db, doc, current_user.id)

@router.get("/documents/{doc_id}", response_model=schemas.DocumentRead)
def get_document(doc_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_document(db, doc_id, current_user.id)

@router.put("/documents/{doc_id}", response_model=schemas.DocumentRead)
def update_document(doc_id: int, doc_update: schemas.DocumentUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.update_document(db, doc_id, doc_update, current_user.id)

@router.post("/documents/{doc_id}/share")
def share_document(doc_id: int, share: schemas.ShareCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.share_document(db, doc_id, share, current_user.id)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # ... existing extension check ...
    contents = await file.read()
    if len(contents) > 1000000: # 1MB limit
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 1MB.")
    # ... rest of the code ...