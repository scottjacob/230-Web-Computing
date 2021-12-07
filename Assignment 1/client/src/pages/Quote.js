//******************************************************** */
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css"

import { Example as NavigationBar } from '../components/NavigationBar';

import axios from "axios";

import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
//******************************************************** */

function Quote() {

    const [searchTerm, setSearchTerm] = useState([]);
    const [rowDataSymbol, setRowDataSymbol] = useState([]);
    // Search ERROR State
    const [searchError400, setSearchError400] = useState(false);
    const [searchError404, setSearchError404] = useState(false);
    
    const GetStocksSymbol = e => {
        e.preventDefault();


        console.log("searchTerm: " + searchTerm);
        // Catch for text inputted values
        if (searchTerm.length === 0) {
            setSearchError404(true);
            return;
        }

        axios.get(`http://131.181.190.87:3000/stocks/${searchTerm}`)
            .then(res => setRowDataSymbol(Array.prototype.concat(res.data)))
            .catch(function (error) {
                console.error(error);
                if (400){
                    setSearchError400(true);
                }
                if (404){
                    setSearchError404(true);
                }
                else {
                    return <div></div>
                }
            })
    }

    function AlertDismissibleError400() {
    
        if (searchError400) {
        return (
            <div>
                <Alert variant="danger" onClose={() => setSearchError400(false)} dismissible>
                    <Alert.Heading>Date parameters only available on authenticated route /stocks/authed</Alert.Heading>
                </Alert>
            </div>
        );
        }
        //return <Button onClick={() => setShow(true)}>Show Alert</Button>;
        return <div></div>;
    }
    function AlertDismissibleError404() {
    
        if (searchError404) {
        return (
            <div>
                <Alert variant="danger" onClose={() => setSearchError404(false)} dismissible>
                    <Alert.Heading>No entry for symbol in stocks database</Alert.Heading>
                </Alert>
            </div>
        );
        }
        //return <Button onClick={() => setShow(true)}>Show Alert</Button>;
        return <div></div>;
    }

    const columns = [
        { headerName: "Timestamp", field: "timestamp" },
        { headerName: "Symbol", field: "symbol", maxWidth: 90},
        { headerName: "Name", field: "name", maxWidth: 150},
        { headerName: "Industry", field: "industry", maxWidth: 180 },
        { headerName: "Open", field: "open", maxWidth: 90},
        { headerName: "High", field: "high", maxWidth: 90},
        { headerName: "Low", field: "low", maxWidth: 90},
        { headerName: "Close", field: "close", maxWidth: 90},
        { headerName: "Volumes", field: "volumes", maxWidth: 120}
    ];

    return (
        <div>
            <NavigationBar />
        <div className="contentGrouping">

            <AlertDismissibleError400 />
            <AlertDismissibleError404 />

            <Container className="interiorGrouping">
            <div className="innerGroupingQuote bg-white rounded">
            <h4 className="display-4">Quotes</h4>
            <p className="muted">Search the Stock Symbol to see the latest snapshot. Must be 1-5 Captial Letters</p>
            <p className="muted">Please select the stock after typing to ensure the stock is retrieved</p>

            <hr></hr>
            <Form onSubmit={GetStocksSymbol}>
                {/* <label>
                    Symbol to Search:
                        <input type="text" name="searchTerm" placeholder="Symbol eg.. AAL" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </label> */}

                <Typeahead id="Menu" placeholder={"Search a symbol e.g. AAL"}
                    value={searchTerm} onChange={e => setSearchTerm(e)}
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
                            rowData={rowDataSymbol}
                            pagination={true}
                            paginationPageSize={50}
                            enableCharts={true}
                            enableRangeSelection={true}
                        />
            </div>
            
        </div>
        </Container>
        </div>
        </div>
    );
}

export default Quote;