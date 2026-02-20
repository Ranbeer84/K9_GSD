"""
Database Diagnostic Script
Run this to see what's in your database and identify issues
"""

import psycopg2
from psycopg2 import sql
import sys

# UPDATED: Match your actual database
DB_CONFIG = {
    'dbname': 'k9_gsd_kennel',  # Your actual database name
    'user': 'kennel_admin',
    'password': 'kennel123',
    'host': 'localhost',
    'port': '5432'
}

def check_database():
    """Check database contents and structure"""
    
    try:
        # Connect to database
        print("\n🔌 Connecting to database...")
        print(f"   Database: {DB_CONFIG['dbname']}")
        print(f"   User: {DB_CONFIG['user']}")
        print(f"   Host: {DB_CONFIG['host']}:{DB_CONFIG['port']}")
        
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("\n" + "=" * 70)
        print("✅ DATABASE CONNECTION SUCCESSFUL")
        print("=" * 70)
        
        # Check if tables exist
        print("\n📋 CHECKING TABLES...")
        print("-" * 70)
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
                print(f"   • {table[0]}")
        else:
            print("❌ NO TABLES FOUND!")
            print("\n🔧 To fix this:")
            print("   1. Make sure backend/database.py import is correct")
            print("   2. Start Flask server: python app.py")
            print("   3. The init_db() function will create tables automatically")
            cursor.close()
            conn.close()
            return
        
        print()
        
        # Check each table
        print("📊 TABLE CONTENTS...")
        print("-" * 70)
        
        table_queries = {
            'admins': "SELECT id, username, email, is_active FROM admins;",
            'dogs': "SELECT id, name, gender, role, is_active, primary_image FROM dogs;",
            'puppies': "SELECT id, name, gender, status FROM puppies;",
            'gallery': "SELECT id, title, media_type, category FROM gallery;",
            'bookings': "SELECT id, customer_name, status FROM bookings;"
        }
        
        for table_name, query in table_queries.items():
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
                count = cursor.fetchone()[0]
                
                if count > 0:
                    print(f"\n✅ {table_name.upper()}: {count} records")
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    for row in rows[:3]:  # Show first 3 rows
                        print(f"   {row}")
                    if count > 3:
                        print(f"   ... and {count - 3} more")
                else:
                    print(f"\n⚠️  {table_name.upper()}: 0 records (empty)")
                    
            except Exception as e:
                print(f"\n❌ {table_name.upper()}: Error - {e}")
        
        # Special check for admin
        print("\n" + "-" * 70)
        print("👤 ADMIN ACCOUNT CHECK...")
        print("-" * 70)
        
        try:
            cursor.execute("SELECT username, email, is_active FROM admins WHERE username = 'admin';")
            admin = cursor.fetchone()
            
            if admin:
                print(f"✅ Admin account exists:")
                print(f"   Username: {admin[0]}")
                print(f"   Email: {admin[1]}")
                print(f"   Active: {admin[2]}")
                print(f"\n   Try logging in at: http://localhost:5173/login")
                print(f"   Username: admin")
                print(f"   Password: admin123 (or check your seed script)")
            else:
                print("❌ Admin account NOT FOUND!")
                print("\n🔧 To create admin:")
                print("   1. Restart Flask server: python app.py")
                print("   2. Admin will be created automatically")
                
        except Exception as e:
            print(f"❌ Error checking admin: {e}")
        
        # Check upload directory
        print("\n" + "-" * 70)
        print("📁 UPLOAD DIRECTORY CHECK...")
        print("-" * 70)
        
        import os
        upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
        
        if os.path.exists(upload_dir):
            print(f"✅ Upload directory exists: {upload_dir}")
            
            subdirs = ['dogs', 'puppies', 'gallery']
            for subdir in subdirs:
                subdir_path = os.path.join(upload_dir, subdir)
                if os.path.exists(subdir_path):
                    files = os.listdir(subdir_path)
                    print(f"   • {subdir}: {len(files)} files")
                    if files:
                        for f in files[:3]:
                            print(f"      - {f}")
                        if len(files) > 3:
                            print(f"      ... and {len(files) - 3} more")
                else:
                    print(f"   ⚠️  {subdir}: Directory doesn't exist")
        else:
            print(f"❌ Upload directory NOT FOUND: {upload_dir}")
            print("   Create with: mkdir -p backend/uploads/dogs backend/uploads/puppies backend/uploads/gallery")
        
        print("\n" + "=" * 70)
        print("✅ DIAGNOSTIC COMPLETE")
        print("=" * 70)
        
        cursor.close()
        conn.close()
        
    except psycopg2.OperationalError as e:
        print("\n" + "=" * 70)
        print("❌ DATABASE CONNECTION FAILED")
        print("=" * 70)
        print(f"\nError: {e}")
        print("\n🔧 TROUBLESHOOTING STEPS:")
        print("\n1. Check if PostgreSQL is running:")
        print("   macOS: brew services list | grep postgresql")
        print("   Linux: sudo systemctl status postgresql")
        print("   Start: brew services start postgresql@15")
        
        print("\n2. Check if database exists:")
        print("   psql -U postgres -l | grep k9_gsd_kennel")
        
        print("\n3. Create database if needed:")
        print("   psql -U postgres")
        print("   CREATE DATABASE k9_gsd_kennel;")
        
        print("\n4. Check user credentials:")
        print("   User: kennel_admin")
        print("   Password: kennel123")
        print("   Update backend/config.py if different")
        
        print("\n5. Grant permissions:")
        print("   psql -U postgres")
        print("   GRANT ALL PRIVILEGES ON DATABASE k9_gsd_kennel TO kennel_admin;")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    print("\n" + "=" * 70)
    print("K9 GSD KENNEL - DATABASE DIAGNOSTIC TOOL")
    print("=" * 70)
    check_database()
    print()