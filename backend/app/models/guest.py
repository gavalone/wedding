from pydantic import BaseModel


class Guest(BaseModel):
    name: str
    dish: str
    alcohol: list[str]
    confirmed: bool = False