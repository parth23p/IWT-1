import { Container } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { useState, useEffect, React } from "react";

import axios from "axios";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const App = () => {
  const [response, setResponse] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [sDate, setStartDate] = useState();
  const [eDate, setEndDate] = useState();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  function onChangeHandler(item) {
    setState([item.selection]);
  }
  useEffect(() => {
    if (state) {
      let sDate = state[0].startDate.toLocaleDateString();
      setStartDate(sDate);
      let eDate = state[0].endDate.toLocaleDateString();
      setEndDate(eDate);
    }
  }, [state]);

  useEffect(() => {
    axios
      .get("https://www.gov.uk/bank-holidays.json")
      .then(function (response) {
        setResponse(response);
        setFilteredData(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <DateRangePicker
        onChange={onChangeHandler}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
      />
      <div>
        <h5>
          <i>
            <b>
              <u>
                "N/A" in Notes column of table means nothing is there in Notes
              </u>
            </b>
          </i>
        </h5>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Dates</th>
            <th>Notes</th>
            <th>Bunting</th>
          </tr>
        </thead>
        <tbody>
          {
            //by default response.data is undefined in js due to hoisting
            filteredData.data
              ? Object.keys(filteredData.data).map((x, y) => {
                  return (
                    <>
                      {filteredData.data[x].events.map((item, index) => {
                        return new Date(item.date) >= new Date(sDate) &&
                          new Date(item.date) <= new Date(eDate) ? (
                          <>
                            <tr key={index}>
                              <td>{item.title}</td>
                              <td>{item.date}</td>
                              <td>{item.notes ? item.notes : "N/A"}</td>
                              <td>{item.bunting.toString()}</td>
                            </tr>
                          </>
                        ) : (
                          ""
                        );
                      })}
                    </>
                  );
                })
              : "No Data Available..!!!"
          }
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
