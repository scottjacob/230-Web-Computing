import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

import { Example as NavigationBar } from '../components/NavigationBar';

import axios from 'axios';


/* Core logic supporting user registration */
function SignUpForm() {

    const [userNameRegister, setUserNameRegister] = useState([]);
    const [passwordRegister, setPasswordRegister] = useState([]);
    // Error Alert states
    const [showCredentialAlert, setCredentialAlert] = useState(false);
    const [showRegisterSuccessAlert, setShowRegisterSuccessAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



    /* POST - (email, password) */
    const RegisterUser = e => {
        e.preventDefault();

        // console.log("searchTerm: " + searchTerm);
        axios.post(`http://131.181.190.87:3000/user/register`, {

            email: userNameRegister,
            password: passwordRegister

        })
        .then(function (response) {
            console.log(response);
            // show alert banner success
            if (201) {
                setShowRegisterSuccessAlert(true);
            }
        })
        .catch(function (error) {
            console.error(error.message);

            if (error.message === 'Request failed with status code 409') {
                setErrorMessage('User already exists!');
            }
            else if (error.message === 'Request failed with status code 400') {
                setErrorMessage('Email and password needed');
            } else {
                setErrorMessage('Oops! something went wrong..')
            }
            setCredentialAlert(true);
        });
        // Clear credentials from form
        setUserNameRegister('');
        setPasswordRegister('');
    }


    /*
    Users Created Currently:
        email: user123@gmail.com , password: 123 - valid
        email: user1234@gmail.com , password: 123 - valid
        email: user12345@gmail.com , password: 123 - valid
        email: user123456@gmail.com, password: 123 - valid
        email: user1234567@gmail.com, password: 123 - valid
        email: user123456789@gmail.com, pasword: 123 - valid
    */

    function AlertDismissibleErrorCredential() {

        if (showCredentialAlert) {
            return (
                <div>
                    <Alert variant="danger" onClose={() => setCredentialAlert(false)} dismissible>
                        <Alert.Heading>{errorMessage}</Alert.Heading>
                    </Alert>
                </div>
            );
        }
        return <div></div>;
    }

    function AlertRegisterSuccess() {

        if (showRegisterSuccessAlert) {
            return (
                <Alert variant="success" onClose={() => setShowRegisterSuccessAlert(false)} dismissible>
                    <Alert.Heading>Success! User has been created. Log in to continue</Alert.Heading>
                </Alert>
            );
        }
        return <div></div>;
    }


    return (
        <div>
            <NavigationBar />
            <div className="contentGroupingSmall">

                <AlertRegisterSuccess />
                <AlertDismissibleErrorCredential />

                <Container className="interiorGrouping">
                    <div className="innerGroupingQuote rounded bg-white">
                        <h2>Sign Up and Register</h2>

                        <Form onSubmit={RegisterUser}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="name@example.com" value={userNameRegister} onChange={e => setUserNameRegister(e.target.value)} />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={passwordRegister} onChange={e => setPasswordRegister(e.target.value)} />
                            </Form.Group>
                            <Button className="stockSubmitBtn py-2 rounded-pill" variant="primary" size="lg" type="submit" block>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default SignUpForm;