import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

import { Example as NavigationBar } from '../components/NavigationBar';

import axios from 'axios';

function LogInForm() {

    const [userNameLogIn, setUserNameLogIn] = useState([]);
    const [passwordLogIn, setPasswordLogIn] = useState([]);
    const [showCredentialAlert, setCredentialAlert] = useState(false);



    const LogInUser = e => {
        e.preventDefault();

        // console.log("searchTerm: " + searchTerm);
        axios.post(`http://131.181.190.87:3000/user/login`, {
            
                email: userNameLogIn,
                password: passwordLogIn

        })
        .then(function (response) {
            console.log(response);

            if(200){
                // redirect the user to the home page after successful login
                window.location.assign("home");
            }

            localStorage.setItem("token", response.data.token);
        })
        .catch(function (error) {
            console.error(error);
            if (401){
                setCredentialAlert(true);
            }
        });

        // Clear credentials after submit
        setUserNameLogIn('');
        setPasswordLogIn('');
    }

    function AlertDismissibleError401() {
    
        if (showCredentialAlert) {
        return (
            <div>
                <Alert variant="danger" onClose={() => setCredentialAlert(false)} dismissible>
                    <Alert.Heading>Oops! wrong password</Alert.Heading>
                </Alert>
            </div>
        );
        }
        return <div></div>;
    }


    return(
        <div>
            <NavigationBar />
            <div className="contentGroupingSmall">

                {/* <AlertLoginSuccess /> */}
                <AlertDismissibleError401 />

                <Container className="interiorGrouping">
                    <div className="innerGroupingQuote rounded bg-white">
                        <h2>Log In</h2>
                        <Form onSubmit={LogInUser}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="name@example.com" value={userNameLogIn} onChange={e => setUserNameLogIn(e.target.value)} />
                                <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={passwordLogIn} onChange={e => setPasswordLogIn(e.target.value)} />
                            </Form.Group>
                            <Button className="stockSubmitBtn py-2 rounded-pill" variant="primary" size="lg" type="submit" block>
                                Log In
                            </Button>
                        </Form>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default LogInForm;