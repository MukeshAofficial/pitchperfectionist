
# PitchPerfectionist FastAPI Backend

This is the backend server for the PitchPerfectionist application. It provides PowerPoint and Word document processing capabilities and integrates with OpenAI for slide enhancement.

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Create a virtual environment (recommended):
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Running the Server

Start the server with:

```
uvicorn server:app --reload
```

The server will be available at http://localhost:8000.

## API Documentation

Once the server is running, you can access the API documentation at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Endpoints

- `GET /health` - Health check endpoint
- `POST /upload-ppt` - Upload a PowerPoint or Word file for processing
- `GET /presentation/{presentation_id}` - Get presentation slides
- `POST /enhance-slide` - Enhance a specific slide

## Integration with Frontend

The frontend should use the API URL: `http://localhost:8000`. You can configure this in your frontend environment variables.
