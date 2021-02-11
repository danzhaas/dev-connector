import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'

export const DashboardActions = () => {
    return (
        <div>
            <div className="dash-buttons">
                {/* <Link to='/edit-profile' class="btn btn-light"> */}
                    <Button href="/edit-profile" variant="outline-primary">
                        <i class="fas fa-user-circle text-primary"></i> Edit Profile
                    </Button>
                     {/* Edit Profile */}
                    {/* </Link> */}
                <Link to='/add-experience' className="btn btn-light"><i class="fab fa-black-tie text-primary"></i> Add Experience</Link>
                <Link to='/add-education' className="btn btn-light"><i class="fas fa-graduation-cap text-primary"></i> Add Education</Link>
            </div>
        </div>
    )
}

export default DashboardActions