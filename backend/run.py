import uvicorn
import os
import sys

base_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(base_dir)

if __name__ == "__main__":
    uvicorn.run("backend.backend.main:app", host="127.0.0.1", port=8000, reload=True, app_dir=parent_dir)
