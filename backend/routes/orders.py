from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.session import get_db
from models.order import Order, OrderStatus
from models.user import User
from api.schemas import OrderResponse, OrderCreate
from services.core import OrderService
from auth.jwt_handler import JWTHandler
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter(prefix="/orders", tags=["Orders"])

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = JWTHandler.decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return payload

@router.post("/", response_model=OrderResponse)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user['sub']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return OrderService.create_order(db, user.id, order_in)

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.email == current_user['sub']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()
