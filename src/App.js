import { useState, useEffect } from 'react';
import moment from 'moment';
import PieChart from './components/pieChart';
import './App.css';
import Table from './components/Table';
import Loader from './components/Loader';
function App() {
  const [currentDate, setCurrentDate] = useState();
  const [vaccineDates, setVaccineDates] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([
      fetch('./data/current_date.json'),
      fetch('./data/vaccine_dates.json'),
    ])
      .then(([resOne, resTwo]) => {
        console.log(resOne, 'rrrrr');
        if (!resOne.ok || !resTwo.ok) {
          return Promise.reject('Could not fetch data!');
        } else {
          return [resOne.json(), resTwo.json()];
        }
      })
      .then((responseText) => {
        responseText[0].then((data) =>
          setCurrentDate(new Date(data.current_date))
        );
        responseText[1].then((data) => setVaccineDates(data));
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleIncrement = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const handleDecrement = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const getGraphData = () => {
    let vaccinatedNumber = 0,
      pendingNumber = 0;
    const totalNumber = vaccineDates.length;
    vaccineDates.forEach((ele) => {
      if (
        moment(currentDate).isBefore(ele['vaccination_date']) ||
        moment(currentDate).isSame(ele['vaccination_date'])
      ) {
        vaccinatedNumber++;
      } else {
        pendingNumber++;
      }
    });
    return [
      [vaccinatedNumber, totalNumber],
      [
        (vaccinatedNumber / totalNumber) * 100,
        (pendingNumber / totalNumber) * 100,
      ],
    ];
  };

  if (error) return <h2 className="text-center text-red"> Unable to fetch data! </h2>;
  if (!currentDate || !vaccineDates) return <Loader />;
  return (
    <div className="App container mx-auto">
      <div className="date flex mx-auto w-60 justify-between mt-4 items-center shadow mb-4">
      <button
          className="w-8 h-8 bg-black text-white hover:bg-gray-700"
          onClick={handleDecrement}
        >
          -
        </button>{' '}
        <div className="currentdate font-bold">
          {moment(currentDate).format('ddd Do MMM YYYY')}
        </div>
        <button
          className="w-8 h-8 bg-black text-white hover:bg-gray-700"
          onClick={handleIncrement}
        >
          +
        </button>{' '}
      </div>
      <h2 className="text-center">
        <span className="font-bold">{getGraphData()[0][0]} </span> out of {' '}
        <span className="font-bold">{getGraphData()[0][1]}</span>
        {' '}people have been vaccinated
      </h2>
      <div className="flex mt-8">
        <div className="flex-50">
          <Table vaccineDates={vaccineDates} currentDate={currentDate} />
        </div>
        <div className="flex-50 mx-20">
          <PieChart data={getGraphData()[1]} />
        </div>
      </div>
    </div>
  );
}

export default App;
