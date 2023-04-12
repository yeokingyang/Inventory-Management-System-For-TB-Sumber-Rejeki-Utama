from django.http import HttpResponse, JsonResponse
import json
from django.shortcuts import render
import pandas as pd
from django.http import HttpResponse
from django.http import JsonResponse
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from sklearn.metrics import mean_squared_error
from math import sqrt
from sklearn.linear_model import LinearRegression

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

        # Prepare the feature matrix X and target vector y for linear regression
        X = np.arange(len(df)).reshape(-1, 1)
        y = df['totalIncome'].values

        # Fit the linear regression model
        model = LinearRegression()
        model.fit(X, y)

        # Forecast 'totalIncome' for the next 3 months
        forecasted_totalCredit = model.predict(X[-1].reshape(-1, 1) + np.arange(1, 4).reshape(-1, 1))

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
            'forecastBy': forecast_by,
            'forecastIncome': forecasted_data,
            'prevData': prev_Data.to_dict(orient='records'),
            'mse': mse,
            'rmse': rmse,
            'mape': mape
        }
        return JsonResponse(response_data)

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

        # Reset the index to have the month as a separate column
        df.reset_index(inplace=True)
        
        prev_Data = df.copy()
        
        if len(df) < 10:
            response_data = {'status': 'failed',  
                             'prevData': prev_Data.to_dict(orient='records'), 
                             'message': 'Monthly quantity sold less than 10, cannot start forecasting using LSM. Please select other item!'}
            return JsonResponse(response_data, status=400)
  
      # Perform Exponential Smoothing State Space Model (ETS) forecasting
        model = ExponentialSmoothing(
            df['quantitySold'], trend='add', seasonal=None, initialization_method='estimated')
        result = model.fit()    

        # Forecast 'quantitySold' for the next 3 months
        forecasted_quantitySold = result.forecast(steps=3)

        # Convert forecasted_quantitySold to list
        forecasted_quantitySold = forecasted_quantitySold.tolist()

        # Calculate error metrics
        mse = mean_squared_error(df['quantitySold'], result.fittedvalues)
        rmse = sqrt(mse)
        mape = np.mean(
            np.abs((df['quantitySold'] - result.fittedvalues) / df['quantitySold'])) * 100

        # Get the last date in df.index to use as the starting point for forecast dates
        last_date = df['date'].max()

        # Prepare the forecasted data to be returned as JSON response
        forecasted_data = []
        for i in range(len(forecasted_quantitySold)):
            forecasted_item = {
                'id': int(df['id'].iloc[-1]) + i + 1,  # Convert to int type
                'iuid': forecast_item_confirm[0]['iuid'],
                'name': forecast_item_confirm[0]['name'],
                'quantitySold': forecasted_quantitySold[i],
                'date': (last_date + pd.DateOffset(months=i+1)).strftime('%Y-%m')
            }
            forecasted_data.append(forecasted_item)
            
            
        # Return the forecastBy and forecastItemConfirm data as JSON response
        response_data = {
            'status': 'success',
            'forecastBy': forecast_by,
            'forecastItemConfirm': forecasted_data,
            'prevData': prev_Data.to_dict(orient='records'),
            'mse': mse,
            'rmse': rmse,
            'mape': mape
        }
        return JsonResponse(response_data)