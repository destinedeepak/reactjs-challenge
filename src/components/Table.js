import React from 'react';
import moment from 'moment';
function Table({ vaccineDates, currentDate }) {
  return (
    <div className="relative mt-14 px-20">
      <div className="h-80vh overflow-auto shadow">
        <table className="border w-full">
          <thead className="absolute -top-10 rigth-0 left-0 px-20">
            <tr className="border">
              <th className="w-96 p-2">Name</th>
              <th className="w-96 p-2">Vaccination Status</th>
            </tr>
          </thead>
          <tbody className="h-52 overflow-scroll">
            {vaccineDates.map((ele) => {
              return (
                <tr className="border">
                  <td className="border p-1 pl-4">{ele['person_name']}</td>

                  {moment(currentDate).isBefore(ele['vaccination_date']) ||
                  moment(currentDate).isSame(ele['vaccination_date']) ? (
                    <td className="text-red-500 border pl-4">
                      Vaccine Pending
                    </td>
                  ) : (
                    <td className="text-green-500 border pl-4">Vaccine Done</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
