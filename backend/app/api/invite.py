from fastapi import APIRouter, HTTPException
from app.services.guest_service import GuestService

router = APIRouter()


@router.get("/guest/{token}")
def get_guest(token: str):
    guest = GuestService.get_guest_full(token)

    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    return guest
