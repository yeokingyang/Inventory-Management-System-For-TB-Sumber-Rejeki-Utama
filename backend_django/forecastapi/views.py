from django.http import HttpResponse, JsonResponse
import json
from django.shortcuts import render
import pandas as pd
from django.http import HttpResponse
from django.http import JsonResponse
import numpy as np
from sklearn.metrics import mean_squared_error
from math import sqrt
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA


def hello(request):
    return HttpResponse("Hello, Django!")

from sklearn.linear_model import LinearRegression

def forecastIncome(request):
    if request.method == 'POST':
        # Get the raw request body
        body = request.body

        # Parse the request body as JSON
        try:
            json_data = json.loads(body)
        except json.JSONDecodeError:
            response_data = {'status': 'error', 'message': 'Invalid JSON data'}
            return JsonResponse(response_data, status=400)

        # Get the forecastBy and forecastItemConfirm data from the parsed JSON
        forecast_by = json_data.get('forecastBy')
        forecastIncome = json_data.get('forecastIncome')
        forecastTime = int(json_data.get('forecastTime'))
        forecastModelType = json_data.get('forecastModelType')
 
        # Perform any necessary processing with the forecastBy and forecastItemConfirm data
        # Load the data into a pandas DataFrame
        df = pd.DataFrame(forecastIncome)

        # Convert 'date' column to datetime data type
        df['date'] = pd.to_datetime(df['date'])

        # Convert 'totalIncome' column to numeric data type
        df['totalIncome'] = pd.to_numeric(df['totalIncome'])

        # Set 'date' column as index
        df.set_index('date', inplace=True)

        # Sort the DataFrame by date in ascending order
        df.sort_values(by='date', inplace=True)

        prev_Data = df.copy()
        prev_Data.index = prev_Data.index.strftime('%y-%m')
        # Reset index back to 'date' column
        prev_Data.reset_index(inplace=True)
        if forecastModelType == "linearregression":
            # Prepare the feature matrix X and target vector y for linear regression
            X = np.arange(len(df)).reshape(-1, 1)
            y = df['totalIncome'].values

            # Fit the linear regression model
            model = LinearRegression()
            model.fit(X, y)

            # Forecast 'totalIncome' for the next 3 months
            forecasted_totalCredit = model.predict(X[-1].reshape(-1, 1) + np.arange(1, forecastTime+1 ).reshape(-1, 1))

            # Calculate error metrics
            mse = mean_squared_error(y, model.predict(X))
            rmse = sqrt(mse)
            mape = np.mean(np.abs((y - model.predict(X)) / y)) * 100

            # Get the last date in df.index to use as the starting point for forecast dates
            last_date = df.index[-1]

            # Prepare the forecasted data to be returned as JSON response
            forecasted_data = []
            for i in range(len(forecasted_totalCredit)):
                forecasted_item = {
                    'totalIncome': forecasted_totalCredit[i],
                    'date': (last_date + pd.DateOffset(months=i + 1)).strftime('%Y-%m')
                }
                forecasted_data.append(forecasted_item)

            # Return the forecastBy and forecastItemConfirm data as JSON response
            response_data = {
                'status': 'success',
                'forecastIncome': forecasted_data,
                'prevData': prev_Data.to_dict(orient='records'),
                'mse': mse,
                'rmse': rmse,
                'mape': mape,
            }
            return JsonResponse(response_data)
        
        elif forecastModelType == "arima":
             # Prepare the feature matrix X and target vector y for ARIMA
            X = df['totalIncome'].astype(float).values
            y = np.arange(len(df))

            # Fit the ARIMA model
            model = ARIMA(X, order=(1, 0, 0))  # Example order: ARIMA(1, 0, 0)
            model_fit = model.fit()

            # Forecast 'totalIncome' for the next forecastTime months
            forecasted_total_income = model_fit.forecast(steps=forecastTime)

            # Calculate error metrics
            mse = mean_squared_error(X, model_fit.fittedvalues)
            rmse = sqrt(mse)
            mape = np.mean(np.abs((X - model_fit.fittedvalues) / X)) * 100

            # Get the last date in df.index to use as the starting point for forecast dates
            last_date = df.index[-1]

            # Prepare the forecasted data to be returned as JSON response
            forecasted_data = []
            for i in range(len(forecasted_total_income)):
                forecasted_item = {
                    'totalIncome': forecasted_total_income[i],
                    'date': (last_date + pd.DateOffset(months=i + 1)).strftime('%Y-%m')
                }
                forecasted_data.append(forecasted_item)

            # Return the forecastBy and forecastItemConfirm data as JSON response
            response_data = {
                'status': 'success',
                'forecastIncome': forecasted_data,
                'prevData': prev_Data.to_dict(orient='records'),
                'mse': mse,
                'rmse': rmse,
                'mape': mape,
             }
            return JsonResponse(response_data)
        
        else:
            response_data = {'status': 'failed',  
                             'message': 'No selected method available'}
            return JsonResponse(response_data, status=400)
  
def forecast(request):
    if request.method == 'POST':
        # Get the raw request body
        body = request.body

        # Parse the request body as JSON
        try:
            json_data = json.loads(body)
        except json.JSONDecodeError:
            response_data = {'status': 'error', 'message': 'Invalid JSON data'}
            return JsonResponse(response_data, status=400)

        # Get the forecastBy and forecastItemConfirm data from the parsed JSON
        forecast_by = json_data.get('forecastBy')
        forecast_item_confirm = json_data.get('forecastItemConfirm')
        forecastTime = int(json_data.get('forecastTime'))
        forecastModelType = json_data.get('forecastModelType')
  

        # Perform any necessary processing with the forecastBy and forecastItemConfirm data
       # Load the data into a pandas DataFrame
        df = pd.DataFrame(forecast_item_confirm)
        

        # Convert 'date' column to datetime data type
        df['date'] = pd.to_datetime(df['date'])

        # Set 'date' column as index
        df.set_index('date', inplace=True)
        
        # Sort the DataFrame by date in ascending order
        df.sort_values(by='date', inplace=True)
        
        # Group the data by month and sum the 'quantity_sold' column
        df = df.resample('M').sum()

        prev_Data = df.copy()
        prev_Data.index = prev_Data.index.strftime('%y-%m')
        # Reset index back to 'date' column
        prev_Data.reset_index(inplace=True)
        
        if forecastModelType == "linearregression":
                # Prepare the feature matrix X and target vector y for linear regression
            X = np.arange(len(df)).reshape(-1, 1)
            y = df['quantitySold'].values

            # Fit the linear regression model
            model = LinearRegression()
            model.fit(X, y)

            # Forecast 'totalIncome' for the next 3 months
            forecasted_quantitySold = model.predict(X[-1].reshape(-1, 1) + np.arange(1, forecastTime+1 ).reshape(-1, 1))

            # Calculate error metrics
            mse = mean_squared_error(y, model.predict(X))
            rmse = sqrt(mse)
            mape = np.mean(np.abs((y - model.predict(X)) / y)) * 100

            # Get the last date in df.index to use as the starting point for forecast dates
            last_date = df.index[-1]

            # Prepare the forecasted data to be returned as JSON response
            forecasted_data = []
            for i in range(len(forecasted_quantitySold)):
                forecasted_item = {
                    'quantitySold': forecasted_quantitySold[i],
                    'date': (last_date + pd.DateOffset(months=i + 1)).strftime('%Y-%m')
                }
                forecasted_data.append(forecasted_item)

            # Return the forecastBy and forecastItemConfirm data as JSON response
            response_data = {
                'status': 'success',
                'forecastItemConfirm': forecasted_data,
                'prevData': prev_Data.to_dict(orient='records'),
                'mse': mse,
                'rmse': rmse,
                'mape': mape,
            }
            return JsonResponse(response_data)
        
        elif forecastModelType == "arima":
             # Prepare the feature matrix X and target vector y for ARIMA
            X = df['quantitySold'].astype(float).values
            y = np.arange(len(df))

            # Fit the ARIMA model
            model = ARIMA(X, order=(1, 0, 0))  # Example order: ARIMA(1, 0, 0)
            model_fit = model.fit()

            # Forecast 'totalIncome' for the next forecastTime months
            forecasted_quantitySold = model_fit.forecast(steps=forecastTime)

            # Calculate error metrics
            mse = mean_squared_error(X, model_fit.fittedvalues)
            rmse = sqrt(mse)
            mape = np.mean(np.abs((X - model_fit.fittedvalues) / X)) * 100

            # Get the last date in df.index to use as the starting point for forecast dates
            last_date = df.index[-1]

            # Prepare the forecasted data to be returned as JSON response
            forecasted_data = []
            for i in range(len(forecasted_quantitySold)):
                forecasted_item = {
                    'quantitySold': forecasted_quantitySold[i],
                    'date': (last_date + pd.DateOffset(months=i + 1)).strftime('%Y-%m')
                }
                forecasted_data.append(forecasted_item)

            # Return the forecastBy and forecastItemConfirm data as JSON response
            response_data = {
                'status': 'success',
                'forecastItemConfirm': forecasted_data,
                'prevData': prev_Data.to_dict(orient='records'),
                'mse': mse,
                'rmse': rmse,
                'mape': mape,
             }
            return JsonResponse(response_data)
        
        else:
            response_data = {'status': 'failed',  
                             'message': 'No selected method available'}
            return JsonResponse(response_data, status=400)