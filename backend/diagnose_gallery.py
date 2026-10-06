"""
Gallery Diagnostic Script
Run this to check if Gallery is set up correctly
"""

from app import create_app
from database import db
from models.gallery import Gallery
import os

def diagnose_gallery():
    """Check Gallery setup and provide detailed diagnostics"""
    
    app = create_app()
    
    with app.app_context():
        print("\n" + "=" * 70)
        print("🔍 GALLERY DIAGNOSTIC REPORT")
        print("=" * 70 + "\n")
        
        # 1. Check upload directory exists
        print("📁 STEP 1: Checking Upload Directory")
        print("-" * 70)
        upload_folder = app.config['UPLOAD_FOLDER']
        gallery_folder = os.path.join(upload_folder, 'gallery')
        
        print(f"Upload folder: {upload_folder}")
        print(f"Gallery folder: {gallery_folder}")
        print(f"Upload folder exists: {os.path.exists(upload_folder)}")
        print(f"Gallery folder exists: {os.path.exists(gallery_folder)}")
        
        if os.path.exists(gallery_folder):
            files = os.listdir(gallery_folder)
            print(f"Files in gallery folder: {len(files)}")
            if files:
                print("\nFiles found:")
                for f in files[:5]:  # Show first 5
                    file_path = os.path.join(gallery_folder, f)
                    size = os.path.getsize(file_path)
                    print(f"  - {f} ({size:,} bytes)")
                if len(files) > 5:
                    print(f"  ... and {len(files) - 5} more files")
        else:
            print("❌ Gallery folder does not exist!")
        
        print()
        
        # 2. Check database records
        print("🗄️  STEP 2: Checking Database Records")
        print("-" * 70)
        
        try:
            all_items = Gallery.query.all()
            active_items = Gallery.query.filter_by(is_active=True).all()
            
            print(f"Total gallery items in DB: {len(all_items)}")
            print(f"Active gallery items: {len(active_items)}")
            
            if all_items:
                print("\nDatabase records (first 5):")
                for item in all_items[:5]:
                    print(f"\n  ID: {item.id}")
                    print(f"  Title: {item.title or 'Untitled'}")
                    print(f"  Category: {item.category}")
                    print(f"  Media Type: {item.media_type}")
                    print(f"  File Path (DB): {item.file_path}")
                    print(f"  Is Active: {item.is_active}")
                    
                    # Check if file exists
                    file_full_path = os.path.join(upload_folder, item.file_path)
                    exists = os.path.exists(file_full_path)
                    print(f"  File Exists: {exists}")
                    if not exists:
                        print(f"  ⚠️  Expected at: {file_full_path}")
                
                if len(all_items) > 5:
                    print(f"\n  ... and {len(all_items) - 5} more records")
            else:
                print("📭 No gallery items in database")
        
        except Exception as e:
            print(f"❌ Error querying database: {e}")
        
        print()
        
        # 3. Check API response format
        print("🌐 STEP 3: Checking API Response Format")
        print("-" * 70)
        
        try:
            if all_items:
                sample_item = all_items[0]
                response_dict = sample_item.to_dict()
                
                print("Sample API response (to_dict()):")
                print(f"  id: {response_dict.get('id')}")
                print(f"  media_type: {response_dict.get('media_type')}")
                print(f"  media_url: {response_dict.get('media_url')}")
                print(f"  file_path: {response_dict.get('file_path')}")
                print(f"  category: {response_dict.get('category')}")
                print(f"  is_active: {response_dict.get('is_active')}")
                
                # Check URL format
                media_url = response_dict.get('media_url')
                if media_url:
                    if media_url.startswith('http://localhost:5002/uploads/'):
                        print("\n  ✅ URL format correct!")
                        print(f"     {media_url}")
                    else:
                        print(f"\n  ❌ URL format incorrect: {media_url}")
                        print("     Should start with: http://localhost:5002/uploads/")
            else:
                print("No items to check")
        
        except Exception as e:
            print(f"❌ Error checking API format: {e}")
        
        print()
        
        # 4. Check Flask route
        print("🛣️  STEP 4: Checking Flask Routes")
        print("-" * 70)
        
        routes = []
        for rule in app.url_map.iter_rules():
            if 'upload' in rule.rule.lower() or 'gallery' in rule.rule.lower():
                routes.append(f"{rule.rule} [{', '.join(rule.methods)}]")
        
        print("Relevant routes found:")
        for route in routes:
            print(f"  {route}")
        
        # Check if uploads route exists
        has_uploads_route = any('/uploads/' in route for route in routes)
        if has_uploads_route:
            print("\n  ✅ /uploads/<path:filename> route exists")
        else:
            print("\n  ❌ /uploads/<path:filename> route NOT FOUND!")
            print("     Add this to app.py:")
            print("     @app.route('/uploads/<path:filename>')")
            print("     def serve_upload(filename):")
            print("         return send_from_directory(upload_folder, filename)")
        
        print()
        
        # 5. Summary and recommendations
        print("📋 SUMMARY")
        print("=" * 70)
        
        issues = []
        
        if not os.path.exists(gallery_folder):
            issues.append("Gallery folder does not exist")
        
        if not all_items:
            issues.append("No gallery items in database")
        
        if all_items and not active_items:
            issues.append("All gallery items are inactive")
        
        if all_items:
            missing_files = []
            for item in all_items:
                file_full_path = os.path.join(upload_folder, item.file_path)
                if not os.path.exists(file_full_path):
                    missing_files.append(item.file_path)
            if missing_files:
                issues.append(f"{len(missing_files)} database records have missing files")
        
        if not has_uploads_route:
            issues.append("/uploads/ route not configured")
        
        if issues:
            print("\n⚠️  ISSUES FOUND:")
            for i, issue in enumerate(issues, 1):
                print(f"   {i}. {issue}")
            
            print("\n🔧 RECOMMENDATIONS:")
            
            if not os.path.exists(gallery_folder):
                print("   1. Create gallery folder:")
                print(f"      mkdir -p {gallery_folder}")
            
            if not all_items:
                print("   2. Upload test image via admin:")
                print("      - Go to http://localhost:5173/admin/gallery")
                print("      - Upload a test image")
            
            if all_items and not active_items:
                print("   3. Activate gallery items:")
                print("      UPDATE gallery SET is_active = true;")
            
            if not has_uploads_route:
                print("   4. Verify /uploads/ route in app.py")
        
        else:
            print("\n✅ ALL CHECKS PASSED!")
            print("\n   Your gallery should be working correctly.")
            print("   If images still don't show:")
            print("   1. Clear browser cache")
            print("   2. Check browser console for errors")
            print("   3. Restart Flask server")
        
        print("\n" + "=" * 70)
        print("End of diagnostic report")
        print("=" * 70 + "\n")


if __name__ == '__main__':
    diagnose_gallery()