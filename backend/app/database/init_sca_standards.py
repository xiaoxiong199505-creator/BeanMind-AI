"""
Initialize SCA Cupping Standards in the database
"""
from app.database.database import SessionLocal, engine
from app.models.sca_standard import SCAStandard

SCA_STANDARDS_DATA = [
    {
        "category": "Fragrance/Aroma",
        "attribute_name": "Fragrance",
        "description": "The aromatic aspects of the dry coffee grounds or after breaking the crust",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "floral, fruity, nutty, chocolate, caramel, spicy, herbal, earthy",
        "example_notes": "Intense jasmine, subtle lemon, warm almond, dark chocolate"
    },
    {
        "category": "Fragrance/Aroma",
        "attribute_name": "Aroma",
        "description": "The aromatic aspects of the coffee when hot water is added",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "floral, fruity, nutty, chocolate, caramel, spicy, herbal, earthy",
        "example_notes": "Bright citrus, stone fruit, honey sweetness, floral top notes"
    },
    {
        "category": "Taste",
        "attribute_name": "Flavor",
        "description": "Taste is the combination of aroma, acidity, and body",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "sweet, sour, salty, bitter, savory, umami",
        "example_notes": "Sweet caramel, bright acidity, clean finish, complex layers"
    },
    {
        "category": "Taste",
        "attribute_name": "Aftertaste",
        "description": "The length of positive flavor qualities remaining after the coffee is spit or swallowed",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "lingering, clean, chocolatey, fruity, nutty, spicy",
        "example_notes": "Long chocolate finish, lingering sweetness, clean aftertaste"
    },
    {
        "category": "Mouthfeel",
        "attribute_name": "Acidity",
        "description": "The dry, bright sensation typical of high elevation coffees",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "bright, crisp, lively, sharp, mild, soft, dull, flat",
        "example_notes": "Bright citric acidity, crisp apple, gentle sparkle"
    },
    {
        "category": "Mouthfeel",
        "attribute_name": "Body",
        "description": "The tactile feel of the coffee in the mouth, described as weight or thickness",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "light, medium, full, heavy, thin, watery, buttery, syrupy",
        "example_notes": "Medium body, silky mouthfeel, smooth texture"
    },
    {
        "category": "Balance",
        "attribute_name": "Balance",
        "description": "How all the aspects of flavor, aftertaste, acidity, and body work together",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "harmonious, complex, simple, disjointed, unbalanced",
        "example_notes": "Well-balanced, harmonious integration, pleasing complexity"
    },
    {
        "category": "Uniformity",
        "attribute_name": "Uniformity",
        "description": "Consistency of flavor among different cups from the same sample",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "consistent, uniform, variable, inconsistent",
        "example_notes": "Consistent across all cups, uniform flavor profile"
    },
    {
        "category": "Clean Cup",
        "attribute_name": "Clean Cup",
        "description": "Absence of negative flavors or off-notes in the coffee",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "clean, pure, muddled, tainted, off-flavors",
        "example_notes": "Clean cup, no off-notes, pure flavor expression"
    },
    {
        "category": "Sweetness",
        "attribute_name": "Sweetness",
        "description": "The pleasing fullness of flavor as perceived on the tongue",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "sweet, cloying, astringent, dry, neutral",
        "example_notes": "Pronounced sweetness, honey-like, natural sugar sweetness"
    },
    {
        "category": "Overall",
        "attribute_name": "Overall",
        "description": "The holistic impression of the coffee, personal experience, and preference",
        "scale_range": "6.0-10.0",
        "typical_descriptors": "exceptional, very good, good, fair, poor",
        "example_notes": "Exceptional quality, memorable cup, high complexity"
    }
]

def init_sca_standards():
    db: Session = SessionLocal()
    try:
        # Check if standards already exist
        existing = db.query(SCAStandard).first()
        if existing:
            print("SCA standards already initialized. Skipping.")
            return
        
        # Add standards
        for standard_data in SCA_STANDARDS_DATA:
            standard = SCAStandard(**standard_data)
            db.add(standard)
        
        db.commit()
        print(f"Successfully initialized {len(SCA_STANDARDS_DATA)} SCA standards")
    except Exception as e:
        db.rollback()
        print(f"Error initializing SCA standards: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_sca_standards()
