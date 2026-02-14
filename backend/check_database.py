"""
Database Diagnostic Script
Run this to see what's actually in your database
"""

import psycopg2
from psycopg2 import sql
import sys

# Database connection details (update these to match your .env)
DB_CONFIG = {
    'dbname': 'k9_kennel_db',
    'user': 'kennel_admin',
    'password': 'kennel123',
    'host': 'localhost',
    'port': '5432'
}

def check_database():
    """Check database contents and structure"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("=" * 60)
        print("DATABASE CONNECTION SUCCESSFUL")
        print("=" * 60)
        print()
        
        # Check if tables exist
        print("📋 CHECKING TABLES...")
        print("-" * 60)
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        
        if tables:
            print("✅ Found tables:")
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print("❌ No tables found! Database needs initialization.")
            return
        
        print()
        
        # Check admins table specifically
        print("👤 CHECKING ADMINS TABLE...")
        print("-" * 60)
        
        try:
            cursor.execute("SELECT COUNT(*) FROM admins;")
            admin_count = cursor.fetchone()[0]
            print(f"Total admins: {admin_count}")
            
            if admin_count > 0:
                cursor.execute("""
                    SELECT id, username, email, full_name, is_active, 
                           created_at, last_login
                    FROM admins;
                """)
                admins = cursor.fetchall()
                
                print("\n✅ Admin accounts found:")
                for admin in admins:
                    print(f"\n   Admin ID: {admin[0]}")
                    print(f"   Username: {admin[1]}")
                    print(f"   Email: {admin[2]}")
                    print(f"   Full Name: {admin[3]}")
                    print(f"   Active: {admin[4]}")
                    print(f"   Created: {admin[5]}")
                    print(f"   Last Login: {admin[6]}")
                    
                # Check password hash format
                cursor.execute("SELECT username, password_hash FROM admins LIMIT 1;")
                username, password_hash = cursor.fetchone()
                print(f"\n   Password hash sample (first 50 chars):")
                print(f"   {password_hash[:50]}...")
                print(f"   Hash length: {len(password_hash)} characters")
                
            else:
                print("❌ No admin accounts found!")
                print("   Run the Flask app once to create default admin.")
                
        except Exception as e:
            print(f"❌ Error reading admins table: {e}")
        
        print()
        
        # Check other tables
        print("📊 CHECKING OTHER TABLES...")
        print("-" * 60)
        
        for table_name in ['dogs', 'puppies', 'gallery', 'bookings']:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
                count = cursor.fetchone()[0]
                print(f"   {table_name}: {count} records")
            except Exception as e:
                print(f"   {table_name}: Error - {e}")
        
        print()
        print("=" * 60)
        print("DIAGNOSTIC COMPLETE")
        print("=" * 60)
        
        cursor.close()
        conn.close()
        
    except psycopg2.OperationalError as e:
        print("=" * 60)
        print("❌ DATABASE CONNECTION FAILED")
        print("=" * 60)
        print(f"\nError: {e}")
        print("\nPossible issues:")
        print("1. PostgreSQL is not running")
        print("2. Database 'k9_kennel_db' doesn't exist")
        print("3. User 'kennel_admin' doesn't exist or password is wrong")
        print("4. Wrong host/port configuration")
        print("\nTo fix:")
        print("1. Start PostgreSQL: sudo systemctl start postgresql")
        print("2. Create database: psql -U postgres -c 'CREATE DATABASE k9_kennel_db;'")
        print("3. Create user: psql -U postgres -c \"CREATE USER kennel_admin WITH PASSWORD 'kennel123';\"")
        print("4. Grant privileges: psql -U postgres -c 'GRANT ALL PRIVILEGES ON DATABASE k9_kennel_db TO kennel_admin;'")
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    check_database()