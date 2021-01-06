import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';  // connects to redux
import { setAlert } from '../../actions/alert'; // the action that sends new alert data to reducer
import { register } from '../../actions/auth'; 
import PropTypes from 'prop-types';

const Register = ({ setAlert, register }) => {
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { 
        name, 
        email, 
        password, 
        password2 
    } = formData;

    const onChange = e => setFormData({
        ...formData, [e.target.name]: e.target.value    // computed property name
    })

    const onSubmit = async e => {
        e.preventDefault(); // prevents form submission which is the default onSubmit for this element
        if (password !== password2) {
            setAlert('Passwords do not match', 'danger')    // calls setAlert action with arguments (msg, alertType)
        } else {
            register({ name, email, password });
            setAlert('Registration successful', 'success')    // calls setAlert action with arguments (msg, alertType)
        }
    }

    return (
        <Fragment> 
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={ e => onSubmit(e) } >
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        name="name"     
                        value={name}    // example of interpolation
                        onChange={e => onChange(e)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value={email}
                        onChange={e => onChange(e)}
                        required 
                    />
                    <small className="form-text"
                        >This site uses Gravatar so if you want a profile image, use a
                        Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        minLength="6"
                        onChange={e => onChange(e)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        minLength="6"
                        onChange={e => onChange(e)}
                        required 
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert:PropTypes.func.isRequired,
    register:PropTypes.func.isRequired
}

{/* Lets us use setAlert within props */}
export default connect(
    null, 
    { setAlert, register }
)(Register);
