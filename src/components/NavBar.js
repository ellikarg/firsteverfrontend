import React from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import logo from '../assets/logo4.png'
import "bootstrap/js/src/collapse.js";
import styles from '../styles/NavBar.module.css'
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';

const NavBar = () => {

    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const {expanded, setExpanded, ref} = useClickOutsideToggle();

    const handleSignOut = async () => {
        try {
            await axios.post("dj-rest-auth/logout/");
            setCurrentUser(null);
        } catch(err) {
            console.log(err)
        }
    };

    const addPostIcon = (
        <NavLink to="/posts/create"
            className={styles.NavLink}
            activeClassName={styles.Active} >
            <i className="fa-solid fa-plus-square"></i>Add Post
        </NavLink>
    )

    const loggedInIcons = 
        <>
        <NavLink to="/feed"
            className={styles.NavLink}
            activeClassName={styles.Active} >
            <i className="fa-solid fa-stream"></i>Feed
        </NavLink>
        <NavLink to="/liked"
            className={styles.NavLink}
            activeClassName={styles.Active} >
            <i className="fa-solid fa-heart"></i>Liked
        </NavLink>
        <NavLink to="/" 
            onClick={handleSignOut}
            className={styles.NavLink} >
            <i className="fa-solid fa-sign-out-alt"></i>Sign out
        </NavLink>
        <NavLink to={`/profiles/${currentUser?.profile_id}`}
            className={styles.NavLink}
            activeClassName={styles.Active} >
            <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
        </NavLink>
        </>

    const loggedOutIcons = 
        <>
            <NavLink to="/signin"
                className={styles.NavLink}
                activeClassName={styles.Active} >
                <i className="fa-solid fa-right-to-bracket"></i>Sign in
            </NavLink>
            <NavLink to="/signup"
                className={styles.NavLink}
                activeClassName={styles.Active} >
                <i className="fa-solid fa-user-plus"></i>Sign up
            </NavLink>
        </>

    return (
        <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
            <Container>
                <NavLink exact to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height={80}></img>
                    </Navbar.Brand>
                </NavLink>
                {currentUser && addPostIcon}
                <Navbar.Toggle
                    ref={ref}
                    onClick={() => setExpanded(!expanded)} 
                    aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-right">
                        <NavLink exact to="/"
                            className={styles.NavLink}
                            activeClassName={styles.Active} >
                            <i className="fas fa-home"></i>Home
                        </NavLink>
                        {currentUser ? loggedInIcons : loggedOutIcons}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
