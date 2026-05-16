import sys
import os
import requests
from datetime import datetime

# Enable direct path mapping to reuse your pre-test shared logging package
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from logging_middleware.logger import SharedLogger, HumanFormatter

# =========================================================================
# CONFIGURATION CREWS: Update this token with your verified auth response
# =========================================================================
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2aWJlZW5hLnIyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MzM1MzYsImlhdCI6MTc3ODkzMjYzNiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImM4NjZlNmQyLTMxYWItNDNhZS1iNGJlLWYwYWFiYTM2MGZjZSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InZpYmVlbmEgciIsInN1YiI6ImI3ZDBkNDA3LWU3OTAtNGUyMy04YmFmLTJmYTcwNTUxOWY2ZSJ9LCJlbWFpbCI6InZpYmVlbmEucjIwMjJAdml0c3R1ZGVudC5hYy5pbiIsIm5hbWUiOiJ2aWJlZW5hIHIiLCJyb2xsTm8iOiIyMm1pczA0MTMiLCJhY2Nlc3NDb2RlIjoiU2ZGdVdnIiwiY2xpZW50SUQiOiJiN2QwZDQwNy1lNzkwLTRlMjMtOGJhZi0yZmE3MDU1MTlmNmUiLCJjbGllbnRTZWNyZXQiOiJCV1ZSdXJudWJyZkZ0d2JqIn0.UNaj6MWbZtalJ5UoFiu8VC_1kjgMeeVEw_jOvJbVhlM"
NOTIFICATIONS_URL = "http://4.224.186.213/evaluation-service/notifications"

# Absolute integer weight rules dictated by requirements
TIER_WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
}

try:
    # Initializing logging middleware using the protected authorization route
    logger = SharedLogger(auth_token=AUTH_TOKEN)
except Exception as init_err:
    print(f"System Crash initializing middleware: {init_err}")
    sys.exit(1)

def calculate_priority_score(item):
    """
    Evaluates element tier rules first (Placement > Result > Event).
    Breaks duplicate category ties using precise chronological epoch integers.
    """
    category = item.get("Type", "Event")
    weight = TIER_WEIGHTS.get(category, 0)
    
    # Parse string date configurations securely to clear secondary sorting checks
    timestamp_epoch = datetime.strptime(item.get("Timestamp"), "%Y-%m-%d %H:%M:%S").timestamp()
    return (weight, timestamp_epoch)

def run_pipeline():
    HumanFormatter.display("backend", "info", "service", "Initiating network requests to fetch current notifications feed...")
    logger.emit_log("backend", "info", "service", "Initiating network requests to fetch current notifications feed.")

    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(NOTIFICATIONS_URL, headers=headers, timeout=10)
        response.raise_for_status()
        
        raw_notifications = response.json().get("notifications", [])
        
        # Sort processing array descending (highest tier weights and newest entries first)
        prioritized_list = sorted(raw_notifications, key=calculate_priority_score, reverse=True)
        
        # Bounded stream window: Extract only the Top 10 indices
        top_ten_alerts = prioritized_list[:10]

        logger.emit_log("backend", "info", "controller", f"Successfully structured priority sorting grid for {len(top_ten_alerts)} records.")
        
        print("\n" + "="*65)
        print("   STAGE 1 VERIFICATION FEED: TOP 10 CAMPUS NOTIFICATIONS ALERT   ")
        print("="*65)
        for rank, node in enumerate(top_ten_alerts, start=1):
            print(f"[Rank {rank:02d}] Type: {node['Type']:<10} | Time: {node['Timestamp']} | {node['Message']}")
        print("="*65 + "\n")
            
    except Exception as network_error:
        error_msg = f"API synchronization failed downstream: {str(network_error)}"
        HumanFormatter.display("backend", "error", "handler", error_msg)
        logger.emit_log("backend", "error", "handler", error_msg)

if __name__ == "__main__":
    if AUTH_TOKEN == "PASTE_YOUR_ACTIVE_BEARER_TOKEN_HERE":
        print("CRITICAL VALIDATION ERROR: Please update the AUTH_TOKEN configuration variable with your bearer string.")
        sys.exit(1)
    run_pipeline()