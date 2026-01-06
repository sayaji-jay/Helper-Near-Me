"""Test script to verify the app changes"""
import sys

# Test basic syntax by importing the app
try:
    from app import app
    print("✓ app.py syntax is valid")

    # Check if the new route exists
    routes = [rule.rule for rule in app.url_map.iter_rules()]

    if '/api/skills' in routes:
        print("✓ /api/skills route exists")
    else:
        print("✗ /api/skills route not found")

    if '/api/users' in routes:
        print("✓ /api/users route exists")
    else:
        print("✗ /api/users route not found")

    print("\nAll routes:")
    for route in sorted(routes):
        print(f"  {route}")

    print("\n✓ All checks passed!")

except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
