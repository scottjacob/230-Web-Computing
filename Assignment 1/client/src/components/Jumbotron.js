import React from 'react';
import {Jumbotron, Container } from 'react-bootstrap';
import "../App.css"

export const Jumbo = (props) => {
  return (
    <div>
      <Jumbotron fluid>
        <Container fluid>
          <div className="jumbodiv rounded">
            <h1 className="display-1 text-white text-center"><b>Stocky</b></h1>
            <hr className="hrJumbo"></hr>
            <p className="text-light text-center">
              The stocks comparison app.
            </p>
          </div>
        </Container>
      </Jumbotron>
    </div>
  );
};