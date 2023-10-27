import React, { useState } from 'react'
import {Form, Button, Alert} from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import axios from "axios";


const SignUpForm = () => {
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
      });
    
    const { username, password1, password2 } = signUpData;

    const [errors, setErrors] = useState({});

    const history = useHistory();

    const handleChange = (event) => {
        setSignUpData({
          ...signUpData,
          [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          await axios.post("/dj-rest-auth/registration/", signUpData);
          history.push("/signin");
        } catch (err) {
            setErrors(err.response?.data);
        }
    };
    
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                />
            </Form.Group>

            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password1">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password1"
                    value={password1}
                    onChange={handleChange}
                />
            </Form.Group>

            {errors.password1?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="formBasicPassword2">
                <Form.Label className="d-none">Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    value={password2}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Text id="passwordHelpBlock" muted>
                Your password must be 8-20 characters long, contain letters and numbers, and
                    must not contain spaces, special characters, or emoji.
            </Form.Text>

            {errors.password2?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
            <Button variant="primary" type="submit">
                Sign Up
            </Button>

        </Form>
    )
}

export default SignUpForm