import React from 'react';
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import logo from '../assets/logo4.png'
import "bootstrap/js/src/collapse.js";
import styles from '../styles/NavBar.module.css'
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';

const NavBar = () => {

    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const handleSignOut = async () => {
        try {
            await axios.post("dj-rest-auth/logout/");
            setCurrentUser(null);
        } catch(err) {
            console.log(err)
        }
    };

    const addPostIcon = (
        <NavLink to="/posts/create">
            <i className="fa-solid fa-plus-square"></i>Add Post
        </NavLink>
    )

    const loggedInIcons = 
        <>
        <NavLink to="/posts/feed">
            <i className="fa-solid fa-stream"></i>Feed
        </NavLink>
        <NavLink to="/posts/liked">
            <i className="fa-solid fa-heart"></i>Liked
        </NavLink>
        <NavLink to="/" onClick={handleSignOut}>
            <i className="fa-solid fa-sign-out-alt"></i>Sign out
        </NavLink>
        <NavLink to={`/profiles/${currentUser?.profile_id}`}>
            <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
        </NavLink>
        </>

    const loggedOutIcons = 
        <>
            <NavLink to="/signin">
                <i className="fa-solid fa-right-to-bracket"></i>Sign in
            </NavLink>
            <NavLink to="/signup">
                <i className="fa-solid fa-user-plus"></i>Sign up
            </NavLink>
        </>

    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container>
                <NavLink exact to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height={80}></img>
                    </Navbar.Brand>
                </NavLink>
                {currentUser && addPostIcon}
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-right">
                        <NavLink exact to="/">
                            <i className="fas fa-home"></i>Home
                        </NavLink>
                        {currentUser ? loggedInIcons : loggedOutIcons}
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
