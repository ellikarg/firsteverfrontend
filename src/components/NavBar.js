import React from 'react';
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import logo from '../assets/logo4.png'
import "bootstrap/js/src/collapse.js";
import styles from '../styles/NavBar.module.css'
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container>
                <Navbar.Brand><img src={logo} alt="logo" height={80}></img></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-right">
                        <NavLink exact to="/"><i className="fas fa-home"></i>Home</NavLink>
                        <NavLink to="/signin"><i className="fa-solid fa-right-to-bracket"></i>Sign in</NavLink>
                        <NavLink to="/signup"><i className="fa-solid fa-user-plus"></i>Sign up</NavLink>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
