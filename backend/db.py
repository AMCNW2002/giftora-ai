
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timezone

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DATABASE", "giftora_ai")]

try:
    client.admin.command("ping")

    product = {
        "name": "Giftora Premium Gift Box",
        "price": 4500,
        "category": "Birthday Gifts",
        "description": "Personalized premium gift box",
        "created_at": datetime.now(timezone.utc)
    }

    result = db.products.insert_one(product)

    print("MongoDB Connected! ✅")
    print("Product saved successfully! 🎁")
    print("Product ID:", result.inserted_id)

except Exception as e:
    print("Error:", e)

finally:
    client.close()
