# api/index.py
import sys
import os

# 将 backend 目录加入到 Python 路径，这样 "from app.data" 才能工作
current_dir = os.path.dirname(os.path.realpath(__file__))
backend_dir = os.path.join(current_dir, "../backend")
sys.path.append(backend_dir)

# 导入原本的 app 实例
from app.main import app
