from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
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

async def get_admin_user(token: str = Depends(oauth2_scheme)):
    payload = JWTHandler.decode_token(token)
    if not payload or payload.get("role") not in ["super_admin", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return payload

class OrderStatusUpdate(BaseModel):
    status: str

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

@router.get("/all", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db), admin: dict = Depends(get_admin_user)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.patch("/{order_id}", response_model=OrderResponse)
def update_order_status(order_id: str, update: OrderStatusUpdate, db: Session = Depends(get_db), admin: dict = Depends(get_admin_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = OrderStatus(update.status)
    if update.status == "completed":
        order.completed_at = func.now()
    db.commit()
    db.refresh(order)
    return order
