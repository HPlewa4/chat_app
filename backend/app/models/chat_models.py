from pydantic import BaseModel


class MsgCreate(BaseModel):
    user: str
    text: str

class MsgOut(BaseModel):
    id: str
    user: str
    text: str