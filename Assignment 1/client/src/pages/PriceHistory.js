import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

import { Example as NavigationBar } from '../components/NavigationBar';

// DatePicker imports
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Typeahead autocomplete
import { Typeahead } from 'react-bootstrap-typeahead';

// Ag-grid React for table components
import { AgGridReact } from 'ag-grid-react';
import { AgChartsReact } from 'ag-charts-react';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css"
import { wait } from '@testing-library/react';

// Un-comment to test login with checkLogIn
//const token = localStorage.getItem("token");



function PriceHistory() {
    // Date and GET states
    const [startDate, setStartDate] = useState(new Date("2019/11/06"));
    const [endDate, setEndDate] = useState(new Date("2020/03/24"));
    const [stockSymbol, setStockSymbol] = useState([]);
    const [rowDataAuth, setRowDataAuth] = useState([]);

    // Search ERROR State
    const [stockSymbolError, setStockSymbolError] = useState(false);
    const [searchError400, setSearchError400] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const GetStocksAuth = e => {
        e.preventDefault();
        
        // format dates for parsing
        let newStartDate = new Date(startDate).toISOString();
        let newEndDate = new Date(endDate).toISOString();
        console.log(newStartDate, newEndDate, stockSymbol);

        // display alert if no symbol, prevents ag-grid parsing error
        if (stockSymbol.length === 0){
            setStockSymbolError(true);
            return;
        }

        const parseToken = localStorage.getItem("token");
        const headers = {
                accept: "application.json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${parseToken}`
            };

        const URL = "http://131.181.190.87:3000/stocks";

        
        fetch(`${URL}/authed/${stockSymbol}?from=${newStartDate}&to=${newEndDate}`, { headers })
        .then((response) => response.json())
        .then((res) => {
            console.log(res);
            if (res.error){
                //console.log("error");
                throw res;
            }
            if (res.length === 1) {
                setRowDataAuth(Array.prototype.concat(res));
                
            } else {
                setRowDataAuth(res);
            }
            
        })
        .catch(function (error) {
            console.error(error);
            setErrorMessage(error.message);
            setSearchError400(true); // Throws to error message if no error header

            if (400) {
                setSearchError400(true);
                setErrorMessage(error.message);

                // check for expired token and redirect
                if (error.message === 'jwt expired') {
                    localStorage.clear('token');
                    wait('3000');
                    window.location.assign('home');
                }
                if (error.message === 'jwt malformed') {
                    setErrorMessage('Log in to continue');
                }
            }
        })
    }

    

    const columns = [
        { headerName: "Timestamp", field: "timestamp", sortable: true },
        { headerName: "Symbol", field: "symbol", maxWidth: 90},
        { headerName: "Name", field: "name", maxWidth: 150},
        { headerName: "Industry", field: "industry", maxWidth: 180 },
        { headerName: "Open", field: "open", sortable: true, maxWidth: 90, filter: "agNumberColumnFilter"},
        { headerName: "High", field: "high", sortable: true, maxWidth: 90, filter: "agNumberColumnFilter"},
        { headerName: "Low", field: "low", sortable: true, maxWidth: 90, filter: "agNumberColumnFilter"},
        { headerName: "Close", field: "close", sortable: true, maxWidth: 90, filter: "agNumberColumnFilter"},
        { headerName: "Volumes", field: "volumes", sortable: true, maxWidth: 120, filter: "agNumberColumnFilter"}
    ];
    

    // CHECK IF TOKEN IN LOCAL STORAGE
    // USED FOR TESTING ONLY - Uncomment accompanying Button and var at top

    // const CheckLoggedIn = e => {
    //     //console.log(typeof(token));
    //     if (token === undefined || token === null) {
    //         console.log("not logged in");
    //         alert("not logged in");
    //         //render( <AlertLoggedIn />);
    //     }
    //     else {
    //         console.log("logged in:\n Token: " + token);
    //     }
    // };

    function AlertDismissibleErrorSymbol() {
    
        if (stockSymbolError) {
        return (
            <div>
                <Alert variant="danger" onClose={() => setStockSymbolError(false)} dismissible>
                    <Alert.Heading>Oops! No entry for symbol in stocks database</Alert.Heading>
                </Alert>
            </div>
        );
        }
        return <div></div>;
    }


    function AlertDismissibleError400() {

        let displayError = errorMessage.toString();
        if (searchError400) {
        return (
            <div>
                <Alert variant="danger" onClose={() => setSearchError400(false)} dismissible>
                    <Alert.Heading>{displayError}</Alert.Heading>
                </Alert>
            </div>
        );
        }
        return <div></div>;
    }


    // Charts options
    // Close values chart options to parse
    const chartOptionsClose = {
        width: 1000,
        height: 600,
        title: {text: `${stockSymbol} Closing value trend`},
        subtitle: {text: 'Submit a stock to view data. Read Right to Left for recent data'},
        data: rowDataAuth,
        series: [{
            xKey: 'timestamp',
            yKey: 'close',
        }],
        axes: [{
            type: 'category',
            position: 'bottom',
            label: {
                rotation: -45,
                padding: 15,
                color: 'rgb(255,255,255)',
            }
        },
        {
            type: 'number',
            position: 'right'

        }],
        legend: {enabled: false},
        enableRtl: false,
    }

    // Volumes chart options to parse
    const chartOptionsVolumes = {
        width: 1000,
        height: 600,
        title: {text: `${stockSymbol} Volumes total trend`},
        subtitle: {text: 'Submit a stock to view data. Read Right to Left for recent data'},
        data: rowDataAuth,
        series: [{
            xKey: 'timestamp',
            yKey: 'volumes',
        }],
        axes: [{
            type: 'category',
            position: 'bottom',
            label: {
                rotation: -45,
                padding: 15,
                color: 'rgb(255,255,255)',
            }
        },
        {
            type: 'number',
            position: 'right'
        }],
        legend: {enabled: false}
    }
    


    return (
        <div>
            <NavigationBar />
            <div className="contentGrouping">

                <AlertDismissibleErrorSymbol />
                <AlertDismissibleError400 />

                <Container className="interiorGrouping">
                    <div className="innerGrouping bg-white rounded">
                        <h4 className="display-4">Price History</h4>
                        <p className="muted">Select Dates and Stock Symbol to see Price History of the Stock. Stock Symbol must be 1-5 Captital Letters</p>
                        <hr></hr>

                        {/* <Button variant="outline-primary" type="button" onClick={CheckLoggedIn}>Check</Button> */}

                        <Form onSubmit={GetStocksAuth}>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend className="inputPrepend"><InputGroup.Text id="basic-addon1">From</InputGroup.Text></InputGroup.Prepend>
                                <DatePicker className="datePickerComp" dateFormat="yyyy-M-dd" minDate={new Date("2019-11-06")}  maxDate={new Date("2020-03-24")} selected={startDate} onChange={setStartDate} shouldCloseOnSelect={false} fixedHeight ></DatePicker>
                                <InputGroup.Prepend><InputGroup.Text id="basic-addon1">To</InputGroup.Text></InputGroup.Prepend>
                                <DatePicker className="datePickerComp" dateFormat="yyyy-M-dd" minDate={startDate} maxDate={new Date("2020-03-24")} selected={endDate} onChange={setEndDate} shouldCloseOnSelect={false} fixedHeight ></DatePicker>
                            </InputGroup>
                            {/* <label>
                                Symbol to Search:
                                    <input type="text" name="searchTerm" placeholder="Symbol eg.. AAL" value={stockSymbol} onChange={e => setStockSymbol(e.target.value)} />
                            </label> */}

                            <Typeahead id="Menu" placeholder={"Search a symbol e.g. AAL"}
                            value={stockSymbol} onChange={e => setStockSymbol(e)}
                            options={["A", "AAL", "AAP", "AAPL", "ABBV", "ABC", "ABT", "ACN", "ADBE", "ADI"
                            , "ADM", "ADP", "ADS", "ADSK", "AEE", "AEP", "AES", "AET", "AFL", "AGN", "AIG", "AIV",
                            "AIZ", "AJG", "AKAM", "ALB", "ALGN", "ALK", "ALL", "ALLE", "ALXN", "AMAT", "AMD", "AME",
                            "AMG", "AMGN", "AMP", "AMT", "ARNC", "ATVI", "AVB", "AVGO", "AVY", "AWK", "AXP", "AYI", "AZO",
                            "BA", "BAC", "BAX", "BBT", "BBY", "BDX", "BEN", "BHF", "BHGE", "BIIB", "BK", "BLK", "BLL", "BMY",
                            "BRK.B", "BSX", "BWA", "BXP", "C", "CA", "CAG", "CAH", "CAT", "CB", "CBG", "CBOE", "CBS", "CCI", "CCL",
                            "CDNS", "CELG", "CERN", "CF", "CFG", "CHD", "CHK", "CHRW", "CHTR", "CI", "CINF", "CL", "CLX", "CMA", "CMCSA",
                            "CME", "CMG", "CMI", "CMS", "CNC", "CNP", "COF", "COG", "COL", "COO", "COP", "COST", "COTY", "CPB", "CRM", "CSCO",
                            "CSRA", "CSX", "CTAS", "CTL", "CTSH", "CTXS", "CVS", "CVX", "CXO", "D", "DAL", "DE", "DFS", "DG", "DGX", "DHI", "DHR",
                            "DIS", "DSICA", "DISCK", "DISH", "DLR", "DLTR", "DOV", "DPS", "DRE", "DRI", "DTE", "DUK", "DVA", "DVN", "DWDP", "DXC", "EA",
                            "EBAY", "ECL", "ED", "EFX", "EIX", "EL", "EMN", "EMR", "EOG", "EQIX", "EQR", "EQT", "ES", "ESRX", "ESS", "ETFC", "ETN", "ETR",
                            "EVHC", "EW", "EXC", "EXPD", "EXPE", "F", "FAST", "FB", "FBHS", "FCX", "FDX", "FE", "FFIV", "FIS", "FISV", "FITB", "FL", "FLIR",
                            "FLR", "FLS", "FMC", "FOX", "FOXA", "FRT", "FTI", "FTV", "GD", "GE", "GGP", "GILD", "GIS", "GLW", "GM", "GOOG", "GOOGL", "GPC", "GPN",
                            "GPS", "GRMN", "GS", "GT", "GWW", "HAL", "HAS", "HBAN", "HBI", "HCA", "HCN", "HCP", "HD", "HES", "HIG", "HII", "HLT", "HOG", "HOLX", "HON",
                            "HP", "HPE", "HPQ", "HRB", "HRL", "HRS", "HSIC", "HST", "HSY", "HUM", "IMB", "ICE", "IDXX", "IFF", "ILMN", "INCY", "INFO", "INTC", "INTU", "IP",
                            "IPG", "IQV", "IRM", "ISRG", "IT", "ITW", "IVZ", "JBHT", "JCI", "JEC", "JNJ", "JNPR", "JPM", "JWN", "K", "KEY", "KHC", "KIM", "KLAC", "KMB", "KMI",
                            "KMX", "KO", "KORS", "KR", "KSS", "KSU", "L", "LB", "LEG", "LEN", "LH", "LKQ", "LLY", "LMT", "LNC", "LOW", "LRCX", "LUK", "LUV", "LYB", "M", "MA", "MAA",
                            "MAC", "MAR", "MAS", "MAT", "MCD", "MCHP", "MCK", "MCO", "MDLZ", "MDT", "MET", "MGM", "MHK", "MKC", "MLM", "MMC", "MMM", "MNST", "MO", "MOS", "MPC", "MRK",
                            "MRO", "MS", "MSFT", "MSI", "MTB", "MTD", "MU", "MYL", "NAVI", "NBL", "NCLH", "NDAQ", "NEE", "NEM", "NFLX", "NI", "NKE", "NLSN", "NOC", "NOV", "NRG", "NSC",
                            "NTAP", "NTRS", "NUE", "NVDA", "NWL", "NWS", "NWSA", "O", "OKE", "OMC", "ORCL", "ORLY", "OXY", "PAYX", "PBCT", "PCAR", "PCG", "PDCO", "PEG", "PEP", "PFE", "PFG",
                            "PG", "PGR", "PH", "PHM", "PKG", "PKI", "PLD", "PM", "PNC", "PNR", "PNW", "PPG", "PPL", "PRGO", "PRU", "PSA", "PSX", "PVH", "PWR", "PXD", "PYPL", "QCOM", "QRVO", "RCL",
                            "RE", "REG", "REGN", "RF", "RHI", "RHT", "RJF", "RL", "RMD", "ROK", "ROP", "ROST", "RRC", "RSG", "RTN", "SBAC", "SBUX", "SCG", "SCHW", "SEE", "SHW", "SIG", "SJM", "SLB", "SLG",
                            "SNA", "SNPS", "SO", "SPG", "SPGI", "SRCL", "SRE", "STI", "STT", "STX", "STZ", "SWK", "SWKS", "SVF", "SYK", "SYMC", "SYY", "T", "TAP", "TDG", "TEL", "TGT", "TIF", "TJX", "TMK", "TMO",
                            "TRP", "TRIP", "TROW", "TRV", "TSCO", "TSN", "TSS", "TXN", "TXT", "UA", "UAA", "UAL", "UDR", "UHS", "ULTA", "UNH", "UNM", "UNP", "UPS", "URI", "USB", "UTX", "V", "VAR", "VFC", "VIAB", "VLO",
                            "VMC", "VNO", "VRSK", "VRSN", "VRTX", "VTR", "VZ", "WAT", "WBA", "WDC", "WEC", "WFC", "WHR", "WLTW", "WM", "WMB", "WMT", "WRK", "WU", "WY", "WYNN", "XEC", "XEL", "XL", "XLNX", "XOM", "XRAY", "XRX",
                            "XYL", "YUM", "ZBH", "ZION", "ZTS"]}
                            />


                            <Button className="stockSubmitBtn py-2 rounded-pill" variant="info" size="lg" type="submit" block>Submit</Button>
                        </Form>

                        <div className="ag-theme-alpine-dark" style={{ height: "600px", width: "100%" }}>
                                <AgGridReact
                                    columnDefs={columns}
                                    rowData={rowDataAuth}
                                    pagination={true}
                                    paginationPageSize={50}
                                    enableCharts={true}
                                    enableRangeSelection={true}
                                />
                        </div>
                        <div className="chartClose">
                            <Container>
                                <AgChartsReact options={chartOptionsClose}/>
                            </Container>
                        </div>
                        <div>
                            <Container>
                                <AgChartsReact options={chartOptionsVolumes}/>
                            </Container>
                        </div>

                    </div>
                </Container>
                
            </div>
        </div>
    );
}

export default PriceHistory;