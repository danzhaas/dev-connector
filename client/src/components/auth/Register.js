import React, { Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';  // Also needed to access back end

const Register = () => {
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
            console.log('Passwords do not match')
        } else {
            // // How to access the back end
            // const newUser = {
            //     name, 
            //     email, 
            //     password
            // }

            // try {
            //     const config = {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }

            //     const body = JSON.stringify(newUser);
                
            //     // successful response returns a jwt
                // const res = await axios.post('/api/users', body, config);
            //     console.log(res.data);
            // } catch (err) {
            //     console.error(err.response.data)
            // }
            console.log('Success');
        }
    }

    return (
        <Fragment> 
            <h1 class="large text-primary">Sign Up</h1>
            <p class="lead"><i class="fas fa-user"></i> Create Your Account</p>
            <form class="form" onSubmit={ e => onSubmit(e) } >
                <div class="form-group">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        name="name"     
                        value={name}    // example of interpolation
                        onChange={e => onChange(e)}
                        required 
                    />
                </div>
                <div class="form-group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value={email}
                        onChange={e => onChange(e)}
                    />
                    <small class="form-text"
                        >This site uses Gravatar so if you want a profile image, use a
                        Gravatar email</small
                    >
                </div>
                <div class="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        minLength="6"
                        onChange={e => onChange(e)}
                    />
                </div>
                <div class="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        minLength="6"
                        onChange={e => onChange(e)}
                    />
                </div>
                <input type="submit" class="btn btn-primary" value="Register" />
            </form>
            <p class="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

export default Register;