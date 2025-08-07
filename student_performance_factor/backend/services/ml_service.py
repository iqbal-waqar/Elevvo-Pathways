import pickle
import os
import numpy as np
from sklearn.metrics import mean_squared_error, r2_score

# Paths to models
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'ml', 'models')
LINEAR_MODEL_PATH = os.path.join(MODELS_DIR, 'linear_model.pkl')
POLY_MODEL_PATH = os.path.join(MODELS_DIR, 'poly_model.pkl')

# Load models
with open(LINEAR_MODEL_PATH, 'rb') as f:
    linear_model = pickle.load(f)

with open(POLY_MODEL_PATH, 'rb') as f:
    poly_model = pickle.load(f)

def predict_score(study_hours: float, model_type: str = 'linear') -> float:
    """
    Predict score based on study hours using specified model
    """
    # Model expects a 2D array
    X = np.array([[study_hours]])
    
    if model_type == 'polynomial':
        return float(poly_model.predict(X)[0])
    else:  # default to linear
        return float(linear_model.predict(X)[0])

def get_model_performance():
    """
    Calculate and return performance metrics for both models
    """
    # Load data for evaluation
    data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'ml', 'data', 'StudentPerformanceFactors.csv')
    import pandas as pd
    df = pd.read_csv(data_path)
    
    X = df[['Hours_Studied']]
    y = df['Exam_Score']
    
    # Predictions
    linear_pred = linear_model.predict(X)
    poly_pred = poly_model.predict(X)
    
    # Metrics
    linear_mse = mean_squared_error(y, linear_pred)
    linear_r2 = r2_score(y, linear_pred)
    
    poly_mse = mean_squared_error(y, poly_pred)
    poly_r2 = r2_score(y, poly_pred)
    
    return {
        'linear': {
            'mse': float(linear_mse),
            'r2': float(linear_r2)
        },
        'polynomial': {
            'mse': float(poly_mse),
            'r2': float(poly_r2)
        }
    }

def get_regression_data(model_type: str = 'linear', x_range: tuple = (0, 30)):
    """
    Generate data points for regression line visualization
    """
    x_min, x_max = x_range
    x_values = np.linspace(x_min, x_max, 100).reshape(-1, 1)
    
    if model_type == 'polynomial':
        y_values = poly_model.predict(x_values)
    else:  # default to linear
        y_values = linear_model.predict(x_values)
    
    return [{'x': float(x), 'y': float(y)} for x, y in zip(x_values.flatten(), y_values)]
