from sqlalchemy.orm import Session
from fastapi import HTTPException
import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session):
    return db.query(models.User).all()


def get_documents_for_user(db: Session, user_id: int):
    owned_docs = db.query(models.Document).filter(models.Document.owner_id == user_id).all()
    shared_docs_ids = [share.document_id for share in
                       db.query(models.DocumentShare).filter(models.DocumentShare.shared_with_user_id == user_id).all()]
    shared_docs = db.query(models.Document).filter(models.Document.id.in_(shared_docs_ids)).all()
    return list({doc.id: doc for doc in (owned_docs + shared_docs)}.values())


def create_document(db: Session, doc: schemas.DocumentCreate, user_id: int):
    db_doc = models.Document(title=doc.title, content=doc.content, owner_id=user_id)
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc


def get_document(db: Session, doc_id: int, user_id: int):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    is_shared = db.query(models.DocumentShare).filter(
        models.DocumentShare.document_id == doc_id,
        models.DocumentShare.shared_with_user_id == user_id
    ).first()

    if doc.owner_id != user_id and not is_shared:
        raise HTTPException(status_code=403, detail="Not authorized to view this document")
    return doc


def update_document(db: Session, doc_id: int, doc_update: schemas.DocumentUpdate, user_id: int):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    is_shared = db.query(models.DocumentShare).filter(
        models.DocumentShare.document_id == doc_id,
        models.DocumentShare.shared_with_user_id == user_id,
        models.DocumentShare.permission == "edit"
    ).first()

    if doc.owner_id != user_id and not is_shared:
        raise HTTPException(status_code=403, detail="Not authorized to edit this document")

    doc.title = doc_update.title
    doc.content = doc_update.content
    db.commit()
    db.refresh(doc)
    return doc


def share_document(db: Session, doc_id: int, share: schemas.ShareCreate, user_id: int):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc or doc.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Only the owner can share this document")

    existing_share = db.query(models.DocumentShare).filter(
        models.DocumentShare.document_id == doc_id,
        models.DocumentShare.shared_with_user_id == share.shared_with_user_id
    ).first()

    if existing_share:
        return {"msg": "Document already shared with this user"}

    new_share = models.DocumentShare(document_id=doc_id, shared_with_user_id=share.shared_with_user_id,
                                     permission=share.permission)
    db.add(new_share)
    db.commit()
    return {"msg": f"Document shared successfully with user {share.shared_with_user_id}"}