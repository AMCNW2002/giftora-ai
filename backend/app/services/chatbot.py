"""
Simple rule-based concierge. Later you can replace `get_reply` with a call to a real
LLM API (OpenAI / Anthropic / Gemini) - nothing else in the project needs to change.
"""
import re

DEFAULT = (
    "I'm your Giftora Concierge! I can recommend handpicked gifts, help you build a "
    "custom gift box within your budget, or answer order questions."
)


def _has(text: str, *words: str) -> bool:
    return any(re.search(rf"\b{re.escape(w)}", text) for w in words)


def get_reply(message: str) -> str:
    text = message.lower()
    if _has(text, "ship", "delivery"):
        return ("🚚 We offer complimentary express delivery on orders over Rs. 80! Standard orders "
                "arrive in 2–4 business days with custom gift-wrapping included.")
    if _has(text, "order", "track", "status"):
        return ("📦 Every Giftora order comes with live SMS tracking and a personalized wax-sealed "
                "gift message. You can manage your bag anytime in your Cart!")
    if _has(text, "box", "build", "budget"):
        return ("🎁 Check out our 'Gift Box' builder in the top navigation! Just choose your recipient "
                "and budget, and our AI will curate an exquisite, ready-to-ship box in seconds.")
    if _has(text, "birthday", "anniversary", "partner"):
        return ("✨ For romantic moments or birthdays, our Eternal Rose Keepsake (Rs. 420) paired with a "
                "Custom Star Map Night Light (Rs. 360) is our most loved duo!")
    if _has(text, "hello", "hi", "hey"):
        return ("Warm greetings! 🌸 Who are you shopping for today? Tell me their interests or your "
                "budget, and I'll find something wonderful.")
    return DEFAULT
