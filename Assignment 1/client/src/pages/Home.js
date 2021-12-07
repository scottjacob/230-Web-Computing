
import React from 'react';


import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';


import { Example as NavigationBar } from '../components/NavigationBar';
import { Jumbo } from '../components/Jumbotron';


const token = localStorage.getItem("token");


function Home() {

    const CheckLoggedIn = e => {

        if (token === undefined || token === null) {
            window.location.assign("login");

        } else {
            window.location.assign("pricehistory");
        }
    };

    return (
        
        <div>
            <NavigationBar />
            <Jumbo />
            <Container className="innerGroupingQuote">               
                <Card bg="primary" className="homeCardOuterWelcome shadow text-center">
                    <Container className="interiorGrouping">
                        <Card.Title as="h1" className="homeCardTitleWelcome text-white">Home</Card.Title>
                        <Card.Text className="homeCardTextWelcome text-white">Welcome to Stocky, the stock market price comparison and viewing app</Card.Text>
                        <hr className="hrJumbo"></hr>
                        <Card.Text className="text-white muted">Explore below or navigate at the top to view stocks or register and login to see historical data</Card.Text>
                        <Button className="mr-sm-2" variant="outline-info" role="button" href="login" id="loginButton">Login</Button>
                        <Button variant="outline-warning" role="button" href="signup" id="registerButton">Register</Button>
                    </Container>
                </Card>
                <CardDeck>
                    <Card className="text-center shadow homeCardOuter" border="light">
                        <Card.Header className="bg-dark text-white homeCardTitle" as="h5">Industries</Card.Header>
                        <Card.Title>Explore Stocks By Industry</Card.Title>
                        <Card.Text>Select Stocks to explore stocks available for viewing or click below</Card.Text>
                        <Card.Footer><Button variant="success" href="stocks">Take me there</Button></Card.Footer>
                    </Card>
                    <Card className="text-center shadow homeCardOuter" border="light">
                        <Card.Header className="bg-dark text-white homeCardTitle" as="h5">Snapshots</Card.Header>
                        <Card.Title>View Stock Snapshots</Card.Title>
                        <Card.Text>Select Quote to view a snapshot for a particular stock or click below</Card.Text>
                        <Card.Footer><Button variant="info" href="quote">Take me there</Button></Card.Footer>
                    </Card>
                    <Card className="text-center shadow homeCardOuter" border="light">
                        <Card.Header className="bg-dark text-white homeCardTitle" as="h5">Historical</Card.Header>
                        <Card.Title>View Historical Data</Card.Title>
                        <Card.Text>Register or login to view Stock trends and historical data or click below</Card.Text>
                        <Card.Footer><Button variant="warning" type="button" onClick={CheckLoggedIn}>Take me there</Button></Card.Footer>
                    </Card>
                </CardDeck>
            </Container>
        </div>
        
    );
}


export default Home;