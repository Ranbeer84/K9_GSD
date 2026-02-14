# Entity-Relationship Diagram

## Database Schema Overview

### Core Entities

```
┌─────────────┐
│   ADMINS    │
├─────────────┤
│ id (PK)     │
│ username    │
│ email       │
│ password    │
└─────────────┘

┌──────────────┐          ┌──────────────┐
│     DOGS     │          │   PUPPIES    │
├──────────────┤          ├──────────────┤
│ id (PK)      │◄────────┤ sire_id (FK) │
│ name         │          │ dam_id (FK)  │
│ gender       │          ├──────────────┤
│ role         │          │ id (PK)      │
│ dob          │          │ name         │
│ description  │          │ gender       │
│ image        │          │ dob          │
└──────────────┘          │ status       │
       │                  │ price        │
       │                  └──────────────┘
       │                         │
       ▼                         ▼
┌──────────────┐          ┌──────────────┐
│ DOG_IMAGES   │          │PUPPY_IMAGES  │
├──────────────┤          ├──────────────┤
│ id (PK)      │          │ id (PK)      │
│ dog_id (FK)  │          │ puppy_id(FK) │
│ image_path   │          │ image_path   │
└──────────────┘          └──────────────┘

                          ┌──────────────┐
                          │   BOOKINGS   │
                          ├──────────────┤
                          │ id (PK)      │
                     ┌───┤ puppy_id(FK) │
                     │    │ customer_*   │
                     │    │ status       │
                     │    │ message      │
                     │    └──────────────┘
                     │
                     └──── Optional Link

┌──────────────┐
│   GALLERY    │
├──────────────┤
│ id (PK)      │
│ title        │
│ media_type   │
│ file_path    │
│ category     │
└──────────────┘
```

## Relationships Explained

### 1. Dogs ↔ Puppies (One-to-Many)

- **Type**: Optional parent relationship
- **Cardinality**: One dog can be parent to many puppies
- **Foreign Keys**:
  - `puppies.sire_id → dogs.id`
  - `puppies.dam_id → dogs.id`
- **On Delete**: SET NULL (preserve puppy records even if parent deleted)
- **Business Rule**: A puppy can have 0, 1, or 2 parent references

### 2. Dogs ↔ Dog_Images (One-to-Many)

- **Type**: Media attachment
- **Cardinality**: One dog can have multiple images
- **Foreign Key**: `dog_images.dog_id → dogs.id`
- **On Delete**: CASCADE (delete all images if dog deleted)
- **Business Rule**: First image by display_order is primary

### 3. Puppies ↔ Puppy_Images (One-to-Many)

- **Type**: Media attachment
- **Cardinality**: One puppy can have multiple images
- **Foreign Key**: `puppy_images.puppy_id → puppies.id`
- **On Delete**: CASCADE (delete all images if puppy deleted)
- **Business Rule**: First image by display_order is primary

### 4. Puppies ↔ Bookings (One-to-Many)

- **Type**: Optional inquiry reference
- **Cardinality**: One puppy can have many inquiries
- **Foreign Key**: `bookings.puppy_id → puppies.id`
- **On Delete**: SET NULL (preserve booking record even if puppy deleted)
- **Business Rule**: Booking can be general inquiry (NULL puppy_id)

### 5. Gallery (Independent)

- **Type**: Standalone media collection
- **No Foreign Keys**: Independent entity
- **Business Rule**: Organized by category (Facility, Events, Previous Litters)

### 6. Admins (Independent)

- **Type**: Authentication entity
- **No Foreign Keys**: No direct data ownership
- **Business Rule**: All content changes are audited by timestamps, not foreign keys

## Key Constraints

### Enum Constraints

```sql
dogs.gender: 'Male', 'Female'
dogs.role: 'Stud', 'Dam', 'Both'
puppies.gender: 'Male', 'Female'
puppies.status: 'Available', 'Reserved', 'Sold'
gallery.media_type: 'Image', 'Video'
bookings.status: 'New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'
```

### Unique Constraints

- `admins.username`
- `admins.email`
- `puppies.microchip_number`

### Email Format Validation

- Applied to `admins.email` and `bookings.customer_email`

## Indexing Strategy

### Performance Optimizations

1. **Puppies**: Status-based filtering (Available/Reserved/Sold)
2. **Dogs**: Role-based filtering (Stud/Dam lookup)
3. **Gallery**: Category grouping
4. **Bookings**: Recent inquiries (created_at DESC)

### Covering Indexes

- Featured puppies (partial index on is_featured = TRUE)
- Active dogs (partial index on is_active = TRUE)

## Data Integrity Rules

### Cascade Deletes

- Delete dog → cascade delete its images
- Delete puppy → cascade delete its images

### Preserve Historical Data

- Delete dog → preserve puppies (parent reference becomes NULL)
- Delete puppy → preserve bookings (puppy reference becomes NULL)

### Auto-Timestamps

- `created_at`: Set on INSERT
- `updated_at`: Auto-updated on every UPDATE via trigger
- `sold_at`: Manually set when status changes to 'Sold'

## Sample Data Flow

### Adding a New Puppy

```
1. INSERT into puppies (basic info)
2. INSERT multiple puppy_images (photos)
3. Public can now view on website
4. Customer submits booking form → INSERT into bookings
5. Admin marks status = 'Reserved' → UPDATE puppies
6. Eventually status = 'Sold' → sold_at timestamp set
```

### Querying Available Puppies with Parents

```sql
SELECT
    p.id, p.name, p.gender, p.price_inr,
    sire.name as father_name,
    dam.name as mother_name
FROM puppies p
LEFT JOIN dogs sire ON p.sire_id = sire.id
LEFT JOIN dogs dam ON p.dam_id = dam.id
WHERE p.status = 'Available'
ORDER BY p.date_of_birth DESC;
```

## Design Decisions

### Why Separate Image Tables?

- Allows multiple photos per entity
- Easy to reorder via `display_order`
- Cleaner file deletion logic

### Why Optional Parent References?

- Some puppies may not have both parents in system
- Allows adding puppies before parent records exist
- Historical data: parents may retire/be removed

### Why No User Accounts Table?

- Public visitors don't need authentication
- Bookings are fire-and-forget inquiries
- Reduces complexity and privacy concerns

### Why Status Enums?

- Data integrity (can't have invalid status)
- Easy filtering in queries
- Clear business state machine

---

**Schema Version**: 1.0  
**Last Updated**: February 2026
