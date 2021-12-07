import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export const NoMatch = () => (

    <div>
        <Container fluid className="contentGroupingSmall">
            <div className="interiorGroupingNoMatch">
                <h2 className="text-white display-2 text-center">404</h2>
                <p className="text-white text-center">Oops! page not found. Click button to return to homepage</p>
                <hr></hr>
                <Container fluid>
                    <Button className="mr-sm-2" size="lg" variant="outline-light" href="home" block>Homepage</Button>
                </Container>
            </div>
        </Container>
    </div>

)