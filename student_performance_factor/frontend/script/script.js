const form = document.getElementById('prediction-form');
const resultDiv = document.getElementById('result');
const updateChartBtn = document.getElementById('updateChart');
const showPerformanceBtn = document.getElementById('showPerformance');
let chartInstance = null;

// Function to show result with animation
function showResult(message, isError = false) {
    resultDiv.textContent = message;
    resultDiv.className = 'result-container show ' + (isError ? 'error' : 'success');
}

// Function to show loading state
function showLoading() {
    resultDiv.innerHTML = '<div class="spinner"></div> Predicting score...';
    resultDiv.className = 'result-container show loading';
}

// Function to hide result
function hideResult() {
    resultDiv.classList.remove('show');
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideResult();
    
    const name = document.getElementById('name').value.trim();
    const study_hours = parseFloat(document.getElementById('study_hours').value);
    const modelType = document.getElementById('modelType').value;
    
    if (!name || isNaN(study_hours)) {
        showResult('Please enter valid data.', true);
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, study_hours })
        });
        
        if (!response.ok) {
            const error = await response.json();
            showResult(error.detail || 'Prediction failed.', true);
            return;
        }
        
        const data = await response.json();
        showResult(`Predicted Score: ${data.score.toFixed(2)} (${modelType} model)`);
    } catch (err) {
        showResult('Error connecting to server.', true);
    }
});

// Function to initialize or update chart
async function updateChart() {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    
    try {
        // Destroy existing chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        const resp = await fetch('/data');
        const rawData = await resp.json();
        
        const xAxis = document.getElementById('xAxis').value;
        const yAxis = document.getElementById('yAxis').value;
        const chartType = document.getElementById('chartType').value;
        
        // Filter out any rows with null/undefined values for selected axes
        const filteredData = rawData.filter(row => 
            row[xAxis] !== null && row[xAxis] !== undefined && 
            row[yAxis] !== null && row[yAxis] !== undefined
        );
        
        // Process data based on chart type
        let chartData, chartOptions;
        
        if (chartType === 'scatter') {
            const points = filteredData.map(row => ({ 
                x: parseFloat(row[xAxis]), 
                y: parseFloat(row[yAxis]) 
            })).filter(point => !isNaN(point.x) && !isNaN(point.y));
            
            chartData = {
                datasets: [{
                    label: `${xAxis} vs ${yAxis}`,
                    data: points,
                    backgroundColor: 'rgba(67, 97, 238, 0.7)',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgba(67, 97, 238, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            };
            
            chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14,
                                family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 37, 41, 0.9)',
                        titleFont: {
                            size: 16,
                            family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                        },
                        bodyFont: {
                            size: 14,
                            family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                        },
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            title: function(tooltipItems) {
                                return `${xAxis} vs ${yAxis}`;
                            },
                            label: function(context) {
                                return `${xAxis}: ${context.parsed.x}
${yAxis}: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: xAxis,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxis,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            };
        } else if (chartType === 'bar') {
            // For bar chart, we'll group data by unique x values and calculate average y
            const groupedData = {};
            filteredData.forEach(row => {
                const xVal = row[xAxis];
                const yVal = parseFloat(row[yAxis]);
                if (!isNaN(yVal)) {
                    if (!groupedData[xVal]) {
                        groupedData[xVal] = { sum: 0, count: 0 };
                    }
                    groupedData[xVal].sum += yVal;
                    groupedData[xVal].count++;
                }
            });
            
            const labels = Object.keys(groupedData).sort();
            const values = labels.map(label => groupedData[label].sum / groupedData[label].count);
            
            chartData = {
                labels: labels,
                datasets: [{
                    label: `${yAxis} by ${xAxis}`,
                    data: values,
                    backgroundColor: 'rgba(67, 97, 238, 0.7)',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    borderWidth: 1
                }]
            };
            
            chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14,
                                family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 37, 41, 0.9)',
                        titleFont: {
                            size: 16,
                            family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                        },
                        bodyFont: {
                            size: 14,
                            family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                        },
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: xAxis,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxis,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            };
        } else if (chartType === 'line') {
            // For line chart, we'll group data by unique x values and calculate average y
            const groupedData = {};
            filteredData.forEach(row => {
                const xVal = row[xAxis];
                const yVal = parseFloat(row[yAxis]);
                if (!isNaN(yVal)) {
                    if (!groupedData[xVal]) {
                        groupedData[xVal] = { sum: 0, count: 0 };
                    }
                    groupedData[xVal].sum += yVal;
                    groupedData[xVal].count++;
                }
            });
            
            const labels = Object.keys(groupedData).sort();
            const values = labels.map(label => groupedData[label].sum / groupedData[label].count);
            
            chartData = {
                labels: labels,
                datasets: [{
                    label: `${yAxis} by ${xAxis}`,
                    data: values,
                    borderColor: 'rgba(67, 97, 238, 1)',
                    backgroundColor: 'rgba(67, 97, 238, 0.2)',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.3
                }]
            };
            
            chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14,
                                family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 37, 41, 0.9)',
                        titleFont: {
                            size: 16,
                            family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                        },
                        bodyFont: {
                            size: 14,
                            family: "'Segoe UI', system-ui, -apple-system, sans-serif"
                        },
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: xAxis,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxis,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            };
        }
        
        // Add regression line if X-axis is Hours_Studied and Y-axis is Exam_Score
        if (xAxis === 'Hours_Studied' && yAxis === 'Exam_Score') {
            const modelType = document.getElementById('modelType').value;
            
            // Fetch regression data
            const regressionResp = await fetch(`/model/regression-data?model_type=${modelType}`);
            const regressionData = await regressionResp.json();
            
            // Add regression line dataset
            chartData.datasets.push({
                label: `${modelType.charAt(0).toUpperCase() + modelType.slice(1)} Regression Line`,
                data: regressionData,
                borderColor: modelType === 'linear' ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)',
                backgroundColor: 'transparent',
                borderWidth: 3,
                pointRadius: 0,
                fill: false,
                tension: 0.2,
                showLine: true
            });
        }
        
        chartInstance = new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: chartOptions
        });
    } catch (err) {
        console.error('Chart error:', err);
        ctx.font = '16px "Segoe UI", system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#6c757d';
        ctx.textAlign = 'center';
        ctx.fillText('Failed to load data for chart.', ctx.canvas.width/2, ctx.canvas.height/2);
    }
}

// Function to show model performance
async function showModelPerformance() {
    const performanceContainer = document.getElementById('modelPerformance');
    const modelType = document.getElementById('modelType').value;
    
    try {
        performanceContainer.innerHTML = '<div class="spinner"></div> Loading performance data...';
        
        const resp = await fetch('/model/performance');
        const performanceData = await resp.json();
        
        const modelData = performanceData[modelType];
        
        performanceContainer.innerHTML = `
            <div class="metric-card">
                <div class="metric-label">Model Type</div>
                <div class="metric-value">${modelType.charAt(0).toUpperCase() + modelType.slice(1)} Regression</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div class="metric-card">
                    <div class="metric-label">R² Score</div>
                    <div class="metric-value">${modelData.r2.toFixed(4)}</div>
                    <div>Higher is better (0-1)</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Mean Squared Error</div>
                    <div class="metric-value">${modelData.mse.toFixed(2)}</div>
                    <div>Lower is better (0-∞)</div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Performance error:', err);
        performanceContainer.innerHTML = '<div class="error">Failed to load performance data.</div>';
    }
}

// Initialize chart on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Set up event listeners
    updateChartBtn.addEventListener('click', updateChart);
    showPerformanceBtn.addEventListener('click', showModelPerformance);
    
    // Load initial chart
    await updateChart();
});
