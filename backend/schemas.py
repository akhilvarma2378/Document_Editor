from pydantic import BaseModel, ConfigDict
from datetime import datetime

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str

class DocumentBase(BaseModel):
    title: str
    content: str

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(DocumentBase):
    pass

class ShareCreate(BaseModel):
    shared_with_user_id: int
    permission: str = "edit"

class DocumentRead(DocumentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime