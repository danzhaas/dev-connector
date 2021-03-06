import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading } , logout}) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/chat/main">
          Chat
        </Link>
      </li>
      <li>
        <Link to="/profiles">
          Developers
        </Link>
      </li>
      <li>
        <Link to="/posts">
          Threads
        </Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>{' '}
          <span className='hide-sm'>My Web</span>
          </Link>
      </li>
      <li>
        <a onClick={ logout } href='#!'>
          <i className="fas fa-sign-out-alt"></i>{' '}
            <span className='hide-sm'>Logout</span>
          </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/chat/main">
          Chat
        </Link>
      </li>
      <li>
        <Link to="/profiles">
          Developers
        </Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  )
  
  return (
      <nav className="navbar">
        <h1>
          <Link id="navbar-brand" to="/">
            <i className="fas fa-spider"></i> Developer Web
          </Link>
        </h1>
        { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
      </nav>
  );
};

Navbar.propTypes = {
  logout:PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth:state.auth
})

export default connect(mapStateToProps, { logout })(Navbar);