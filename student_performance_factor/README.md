# Student Performance Predictor

A web application that predicts student exam scores based on study hours using machine learning.

## Features

- Predict student exam scores based on study hours
- Compare Linear and Polynomial regression models
- Interactive data visualization with multiple chart types
- Select any two variables for X and Y axes
- Real-time chart updates with different visualization options
- Visualize regression lines on scatter plots
- View model performance metrics (R² score and Mean Squared Error)
- Modern, responsive UI with real-time feedback
- Data persistence using PostgreSQL database

## Prerequisites

- Python 3.8 or higher
- PostgreSQL database
- pip (Python package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd student_performance_factor
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. Set up the PostgreSQL database:
   - Install PostgreSQL if not already installed
   - Create a database named `student_performance`
   - Update the database credentials in `backend/db/db.py` if needed:
     ```python
     DATABASE_URL = "postgresql://username:password@localhost:5432/student_performance"
     ```

5. Run database migrations:
   ```bash
   cd backend/db/migration/alembic
   alembic upgrade head
   cd ../../../..
   ```

## Running the Application

1. Start the backend server:
   ```bash
   uvicorn backend.main:app --reload --port 8001
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8001
   ```

## Project Structure

```
student_performance_factor/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── db/                  # Database configuration and models
│   ├── interactors/         # Business logic
│   ├── schemas/             # Pydantic models
│   └── services/            # ML service
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── style/
│   │   └── style.css        # Styling
│   └── script/
│       └── script.js        # Client-side JavaScript
├── ml/
│   ├── model.pkl            # Trained ML model
│   └── data/                # Training data
└── data/
    └── StudentPerformanceFactors.csv  # Dataset
```

## API Endpoints

- `GET /` - Serve the frontend application
- `GET /data` - Get all data for visualization
- `GET /data/columns` - Get list of available columns
- `POST /predict` - Predict student score based on study hours
- `GET /model/performance` - Get performance metrics for regression models
- `GET /model/regression-data` - Get data points for regression line visualization

## Graph Features

The application now includes interactive data visualization with the following features:
- Multiple chart types: Scatter plot, Bar chart, and Line chart
- Select any two variables for X and Y axes
- Real-time chart updates with the "Update Chart" button
- Responsive design that works on all devices
- Tooltips with detailed information on hover

## Development

To modify the frontend:
- Edit files in the `frontend/` directory
- Changes will be served automatically when the server is running

To modify the backend:
- Edit files in the `backend/` directory
- The server will reload automatically with `--reload` flag

## Machine Learning Models

The application now includes two regression models for predicting student performance:

1. **Linear Regression Model**: Models the relationship between study hours and exam scores as a straight line
2. **Polynomial Regression Model**: Models the relationship as a curved line (degree 2 polynomial) for more complex patterns

### Model Training

To retrain the models:
```bash
cd ml
python train_model.py
```

### Model Performance

The models are evaluated using:
- **R² Score**: Proportion of variance in the target variable predictable from the features (higher is better, range 0-1)
- **Mean Squared Error**: Average of squares of differences between predicted and actual values (lower is better)

### Feature Engineering

The models currently use only "Hours_Studied" as a feature. You can experiment with different feature combinations by modifying the `ml/train_model.py` file to include additional features like:
- Attendance
- Sleep_Hours
- Previous_Scores
- Tutoring_Sessions

## Troubleshooting

1. If you get database connection errors:
   - Ensure PostgreSQL is running
   - Verify database credentials in `backend/db/db.py`
   - Check that the `student_performance` database exists

2. If you get module not found errors:
   - Ensure you're in the correct virtual environment
   - Reinstall dependencies with `pip install -r backend/requirements.txt`

3. If the frontend doesn't load:
   - Ensure the backend server is running
   - Check the browser console for errors