from pydantic import BaseModel


class ProductOut(BaseModel):
    id: int
    name: str
    category: str
    price: float
    rating: float
    tag: str | None = None
    image: str
    description: str
