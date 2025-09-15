FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=4567

WORKDIR /app

# Si usas requirements.txt, mejor. Si no, instala directo:
# COPY requirements.txt ./
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir flask==3.0.3 gunicorn==22.0.0

COPY shacollition.py ./shacollition.py
COPY templates ./templates

EXPOSE 4567

# Gunicorn en producción: 2 workers, bind al PORT
CMD ["bash", "-lc", "exec gunicorn -w 2 -b 0.0.0.0:${PORT} shacollition:app"]
