import requests
import json
from datetime import datetime

class SharedLogger:
    """
    Reusable logging package handling token-authorized telemetry transmissions.
    """
    def __init__(self, auth_token: str, base_url: str = "http://4.224.186.213"):
        self.auth_token = auth_token
        self.endpoint = f"{base_url}/evaluation-service/logs"
        
        # Exact valid string value states dictated by constraints
        self.valid_stacks = {"backend", "frontend"}
        self.valid_levels = {"debug", "info", "warn", "error", "fatal"}

    def emit_log(self, stack: str, level: str, package: str, message: str) -> dict:
        """
        Executes Log(stack, level, package, message) logic against the remote server.
        """
        # Lowercase enforcement as specified by constraints
        stack_ln = stack.lower()
        level_ln = level.lower()
        package_ln = package.lower()

        if stack_ln not in self.valid_stacks:
            raise ValueError(f"Invalid stack target context: {stack}")
        if level_ln not in self.valid_levels:
            raise ValueError(f"Invalid error severity level window: {level}")

        payload = {
            "stack": stack_ln,
            "level": level_ln,
            "package": package_ln,
            "message": message
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.auth_token}"
        }

        try:
            response = requests.post(self.endpoint, headers=headers, json=payload, timeout=5)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[Logger Warning] Logging endpoint rejected request with status: {response.status_code}")
                return {}
        except Exception as err:
            print(f"[Logger Core Error] Failed transferring logging telemetry: {err}")
            return {}

class HumanFormatter:
    @staticmethod
    def display(stack: str, level: str, package: str, msg: str):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level.upper()}] ({stack}/{package}): {msg}")