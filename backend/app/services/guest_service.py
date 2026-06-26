import json
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


class GuestService:

    @staticmethod
    def load_guests():
        guests_json = os.getenv("GUESTS_JSON")

        if guests_json:
            return json.loads(guests_json)

        with open(DATA_DIR / "guests.json", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def load_menu():
        menu_json = os.getenv("MENU_JSON")
        if menu_json:
            return json.loads(menu_json)

        with open(DATA_DIR / "menu.json", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def load_alcohol():
        alcohol_json = os.getenv("ALCOHOL_JSON")
        if alcohol_json:
            return json.loads(alcohol_json)

        with open(DATA_DIR / "alcohol.json", encoding="utf-8") as f:
            return json.load(f)

    @classmethod
    def get_guest_full(cls, token: str):
        guests = cls.load_guests()
        menu = cls.load_menu()
        alcohol_db = cls.load_alcohol()

        guest = guests.get(token)
        if not guest:
            return None

        # --- блюда ---
        dishes = guest.get("dishes", {})

        enriched_dishes = {
            key: menu.get(value)
            for key, value in dishes.items()
        }

        # --- алкоголь ---
        alcohol_list = guest.get("alcohol", [])

        enriched_alcohol = [
            alcohol_db.get(a) for a in alcohol_list if a in alcohol_db
        ]

        return {
            "name": guest["name"],
            "dishes": enriched_dishes,
            "alcohol": enriched_alcohol,
            "event": {
                "place": "Ресторан-бар-караоке «Сытый лось», ул. Большая Семеновская, 50",
                "time": "4 июля 2026, сбор в 19:00",
                "dresscode": "Друзья, как такового дресс-кода нет, приходите нарядные и так, чтобы вам было комфортно! Единственное пожелание невесты - не в белом)",
            }
        }