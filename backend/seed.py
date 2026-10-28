from database import seed_products

if __name__ == "__main__":
    products = seed_products()
    print(f"Seeded {len(products)} products into the database.")
