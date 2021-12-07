//******************************************************** */
import React, { useState } from 'react';

//import { Button, Tabs, Tab, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css"

import { Example as NavigationBar } from '../components/NavigationBar';

import axios from "axios";
//******************************************************** */



function Stocks() {

    const [searchTerm, setSearchTerm] = useState([]);
    const [rowData, setRowData] = useState([]);

    const GetStocks = e => {
        e.preventDefault();

        console.log("searchTerm: " + searchTerm);
        axios.get(`http://131.181.190.87:3000/stocks/symbols?`, {
            params: {
                industry: searchTerm
            }
        })
            .then(res => setRowData(res.data))
            .catch(function (error) {
                console.log(error);
            });
    }


    const columns = [
        { headerName: "Name", field: "name", sortable: true, minWidth: 400, filter: "agTextColumnFilter" },
        { headerName: "Symbol", field: "symbol", sortable: true, minWidth: 300, filter: "agTextColumnFilter"},
        { headerName: "Industry", field: "industry", sortable: true, minWidth: 400, filter: "agTextColumnFilter" }
    ];


    return (
        <div>
            <NavigationBar />
            <div className="contentGrouping">
                <Container className="interiorGrouping">
                    <div className="innerGrouping bg-white rounded">
                        <h4 className="display-4">Stocks</h4>
                        <p className="muted"> Selecting Blank and searching will search for all industries.</p>
                        <hr></hr>
                        <Form onSubmit={GetStocks}>
                            <Form.Group controlId="industryFormSelect">
                                <Form.Label>Select Industry: </Form.Label>
                                <Form.Control as="select" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}>
                                    <option></option>
                                    <option>Health Care</option>
                                    <option>Industrials</option>
                                    <option>Consumer Discretionary</option>
                                    <option>Consumer Staples</option>
                                    <option>Information Technology</option>
                                    <option>Utilities</option>
                                    <option>Financials</option>
                                    <option>Real Estate</option>
                                    <option>Materials</option>
                                    <option>Energy</option>
                                    <option>Telecommunication Services</option>
                                </Form.Control>
                                <Button className="stockSubmitBtn py-2 rounded-pill" variant="info" size="lg" type="submit" block>Submit</Button>
                            </Form.Group> 
                        </Form>
                        <Container>
                            <div className="ag-theme-alpine-dark" style={{ height: "700px", width: "100%" }}>
                                <AgGridReact
                                    columnDefs={columns}
                                    rowData={rowData}
                                    pagination={true}
                                    paginationPageSize={50}
                                />
                            </div>
                        </Container>
                    </div>
                </Container>
            </div>
        </div>
    );

}

export default Stocks;