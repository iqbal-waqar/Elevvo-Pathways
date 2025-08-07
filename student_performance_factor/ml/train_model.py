import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline
import pickle
import os
import numpy as np

data_path = os.path.join(os.path.dirname(__file__), 'data', 'StudentPerformanceFactors.csv')
df = pd.read_csv(data_path)

# Use correct column names
X = df[['Hours_Studied']]
y = df['Exam_Score']

# Train Linear Regression Model
linear_model = LinearRegression()
linear_model.fit(X, y)

# Train Polynomial Regression Model (degree 2)
poly_model = Pipeline([
    ('poly', PolynomialFeatures(degree=2)),
    ('linear', LinearRegression())
])
poly_model.fit(X, y)

# Save both models
models_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(models_dir, exist_ok=True)

linear_model_path = os.path.join(models_dir, 'linear_model.pkl')
with open(linear_model_path, 'wb') as f:
    pickle.dump(linear_model, f)

poly_model_path = os.path.join(models_dir, 'poly_model.pkl')
with open(poly_model_path, 'wb') as f:
    pickle.dump(poly_model, f)

print('Linear model trained and saved to', linear_model_path)
print('Polynomial model trained and saved to', poly_model_path)

# Test predictions
test_hours = np.array([[5], [10], [15], [20], [25], [30]])
print("\nTest Predictions:")
print("Hours\tLinear\tPolynomial")
for hours in test_hours:
    linear_pred = linear_model.predict([hours])[0]
    poly_pred = poly_model.predict([hours])[0]
    print(f"{hours[0]}\t{linear_pred:.2f}\t{poly_pred:.2f}")