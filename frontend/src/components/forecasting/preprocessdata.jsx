import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HiChevronLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Preprocessdata = () => {
  const location = useLocation();
  const forecastItem = location.state.forecastItem;
  const [uniqueQuantifications, setUniqueQuantifications] = useState([]);
  const [selectedQuantification, setSelectedQuantification] = useState('');
  const [conversionFactor, setConversionFactor] = useState(1);
  const [operation, setOperation] = useState('');
  const [convertedQuantification, setConvertedQuantification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [convertedItems, setConvertedItems] = useState([]);
  const [forecastBy, setForecastBy] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (forecastItem) {
      const quantifications = forecastItem.map(item => item.quantification);
      const uniqueValues = Array.from(new Set(quantifications));
      setUniqueQuantifications(uniqueValues);
    }
  }, [forecastItem]);



  const handleConversionFactorChange = (event) => {
    setConversionFactor(event.target.value);
  };

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
  };

  const handleQuantificationChange = (event) => {
    setSelectedQuantification(event.target.value);
  };

  const handleConvertedQuantification = (e) => {
    setConvertedQuantification(e.target.value);
  };
  const handleForecastByChange = (e) => {
    setForecastBy(e.target.value);
  };

  
  const gotoNextpage = async () => {
    const confirmed = window.confirm(`Are you sure you want to proceed?`);
    if (confirmed) {
      try {
        if (convertedItems.length <= 0) {

          // Filter forecastItem to only include data from 6 months ago
          const sevenMonthsAgo = new Date();
          sevenMonthsAgo.setHours(0, 0, 0, 0); // Reset time component to midnight
          sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
          const filteredForecastItem = forecastItem.filter(item => new Date(item.date) > sevenMonthsAgo);

    
          navigate('/analytics/modelpredict', { state: { forecastItemConfirm: filteredForecastItem, forecastBy: "quantitySold" } });

        }
        else {
       
          navigate('/analytics/modelpredict', { state: { forecastItemConfirm: convertedItems, forecastBy: "quantitySold" } });
        }

      } catch (error) {
        console.error(error);
      }
    }
  }


  const handleConvertButtonClick = () => {
    const confirmed = window.confirm(`Are you sure you want to select ${selectedQuantification} to convert to ${convertedQuantification} ?`);
    if (confirmed) {
      if (selectedQuantification && conversionFactor && operation && convertedQuantification) {
        // Perform conversion logic based on selectedQuantification, conversionFactor, and operation
        setIsLoading(true);
        const sevenMonthsAgo = new Date();
        sevenMonthsAgo.setHours(0, 0, 0, 0); // Reset time component to midnight
        sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

        Promise.all(
          forecastItem.map(item => {
            return new Promise(resolve => {
              if (item.quantification === selectedQuantification) {
                const convertedItem = { ...item }; // Create a new object for the item
                if (operation === 'multiply') {
                  convertedItem.quantitySold = item.quantitySold * conversionFactor;
                  convertedItem.quantification = convertedQuantification;
                } else if (operation === 'division') {
                  convertedItem.quantitySold = item.quantitySold / conversionFactor;
                  convertedItem.quantification = convertedQuantification;
                }
                resolve(convertedItem); // Return the updated item object
              } else {
                resolve(item); // Return the original item object for other items
              }
            });
          })
        ).then(convertedItems => {
          // Update forecastItem with converted items
          // Replace the forecastItem with convertedItems in your state management system
          const filteredConvertedItems = convertedItems.filter(item => new Date(item.date) > sevenMonthsAgo);
          setConvertedItems(filteredConvertedItems);
          setIsLoading(false);
        });
      }
    }
  };



  return (

    <div>
      {isLoading && <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 opacity-50 z-50"></div>}
      {isLoading && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-2xl z-50">Loading...</div>}
      <div className="sticky top-0 bg-gray-800 p-4 z-15 border">
        <div className="flex items-center">
          <Link className="text-white flex items-center" to={`/analytics`}>
            <HiChevronLeft className="mr-2" />
            <span className="uppercase text-sm select-none">
              Go Back
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-white mt-10">Preprocess Data</h1>

        </div>
      </div>
      <div id="firstpart">
        {convertedItems.length <= 0 && (
          <div className="container mx-auto border">
            {forecastItem ? (
              <>
                <h2 className="text-xl font-bold mb-2 text-white">Unique Quantifications:</h2>
                {uniqueQuantifications.length > 0 ? (
                  uniqueQuantifications.length > 1 ? (
                    <>
                      <p className="text-white">
                        Please edit the quantification of {forecastItem[0].name} to have the same value.
                      </p>
                      <label htmlFor="quantificationSelect" className="block text-white mt-4">
                        Select Quantification from:
                      </label>
                      <select
                        id="quantificationSelect"
                        value={selectedQuantification}
                        onChange={handleQuantificationChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">-- Select the Quantification to convert from--</option>
                        {uniqueQuantifications.map((quantification, index) => (
                          <option key={index} value={quantification}>{quantification}</option>
                        ))}
                      </select>

                      <label htmlFor="operationSelect" className="block text-white mt-4">
                        Select Operation:
                      </label>
                      <select
                        id="operationSelect"
                        value={operation}
                        onChange={handleOperationChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">-- Select Operation --</option>
                        <option value="multiply">Multiply</option>
                        <option value="division">Division</option>
                      </select>

                      <label htmlFor="conversionFactorInput" className="block text-white mt-4">
                        Conversion Factor:
                      </label>
                      <input
                        id="conversionFactorInput"
                        type="number"
                        value={conversionFactor}
                        onChange={handleConversionFactorChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm                  "
                      />

                      <label htmlFor="convertedQuantification" className="block text-white mt-4">
                        Select Quantification to:
                      </label>
                      <select
                        id="convertedQuantification"
                        value={convertedQuantification}
                        onChange={handleConvertedQuantification}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">-- Select the Quantification to convert to--</option>
                        {uniqueQuantifications.map((quantification, index) => (
                          <option key={index} value={quantification}>{quantification}</option>
                        ))}
                      </select>

                      <button
                        onClick={handleConvertButtonClick}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
                      >
                        Convert
                      </button>


                    </>
                  ) : (
                    <div>
                      <p className="text-white">All quantifications are already the same for {forecastItem[0].name}.</p>
                      <label htmlFor="forecastByselect" className="block text-white mt-4">
                        Select What to Forecast:
                      </label>
                      <select
                        id="forecastBySelect"
                        value={forecastBy.length > 0 ? forecastBy[0] : ""}
                        onChange={handleForecastByChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">-- Select Operation --</option>
                        <option value="totalCredit">Total Income for next months</option>
                        <option value="quantitySold">total Quantity item sold for next months</option>
                      </select>
                      <button onClick={() => gotoNextpage()} className="inline-block align-middle px-4 py-2 mx-2 bg-gray-300 hover:text-red-700 leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out group"
                      >
                        <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Confirm untuk pindah ke step selanjutnya</span>
                        Confirm
                      </button>

                      <table className="w-full border border-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-2 border text-left">Name</th>
                            <th className="px-4 py-2 border text-left">Type</th>
                            <th className="px-4 py-2 border text-left">Price</th>
                            <th className="px-4 py-2 border text-left">Quantity Sold</th>
                            <th className="px-4 py-2 border text-left">Quantification</th>
                            <th className="px-4 py-2 border text-left">Total Price</th>
                            <th className="px-4 py-2 border text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {forecastItem.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-700 text-white' : 'bg-gray-600 text-white'}>
                              <td className="px-4 py-2">{item.name}</td>
                              <td className="px-4 py-2">{item.type}</td>
                              <td className="px-4 py-2">{item.credit}</td>
                              <td className="px-4 py-2">{item.quantitySold}</td>
                              <td className="px-4 py-2">{item.quantification}</td>
                              <td className="px-4 py-2">{item.totalCredit}</td>
                              <td className="px-4 py-2 ">{item.date.slice(0, 10)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>


                  )
                ) : (
                  <p className="text-white">No quantifications found for {forecastItem[0].name}.</p>
                )}
              </>
            ) : (
              <p className="text-white">No forecast item found.</p>
            )}

          </div>
        )}
      </div>
      <div id="second part">
        {convertedItems.length > 0 && (
          <div className="w-full max-w-2xl ml-4">
            <div className="sticky top-0 bg-gray-800 p-4 z-15 border">
              <h2 className="text-2xl font-bold mb-4 text-white">Converted Forecast Item</h2>
              <label htmlFor="forecastByselect" className="block text-white mt-4">
                Select What to Forecast:
              </label>
              <select
                id="forecastBySelect"
                value={forecastBy.length > 0 ? forecastBy[0] : ""}
                onChange={handleForecastByChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">-- Select Operation --</option>
                <option value="totalCredit">Total Income for next months</option>
                <option value="quantitySold">total Quantity item sold for next months</option>
              </select>
              <button onClick={() => gotoNextpage()} className="inline-block align-middle px-4 py-2 mx-2 bg-gray-300 hover:text-red-700 leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out group"
              >
                <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Confirm untuk pindah ke step selanjutnya</span>
                Confirm
              </button>
            </div>
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border text-left">Name</th>
                  <th className="px-4 py-2 border text-left">Type</th>
                  <th className="px-4 py-2 border text-left">Price</th>
                  <th className="px-4 py-2 border text-left">Quantity Sold</th>
                  <th className="px-4 py-2 border text-left">Quantification</th>
                  <th className="px-4 py-2 border text-left">Total Price</th>
                  <th className="px-4 py-2 border text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {convertedItems.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-700 text-white' : 'bg-gray-600 text-white'}>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.type}</td>
                    <td className="px-4 py-2">{item.credit}</td>
                    <td className="px-4 py-2">{item.quantitySold}</td>
                    <td className="px-4 py-2">{item.quantification}</td>
                    <td className="px-4 py-2">{item.totalCredit}</td>
                    <td className="px-4 py-2 ">{item.date.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Preprocessdata;

