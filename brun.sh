#!/bin/bash
cd ~/projects/chat_app/backend
source .venv/bin/activate
uvicorn app.main:app --reload
