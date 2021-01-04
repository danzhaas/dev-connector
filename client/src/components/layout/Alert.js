import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';  // allows connection from newly-updated state to the front-end

const Alert = ({ alerts }) => 
    alerts !== null && 
    alerts.length > 0 &&
    alerts.map(alert => (
        <div key='alert.id' className={`alert alert-${alert.alertType}`}>
            { alert.msg }
        </div>
    ))

    Alert.propTypes = {
        alerts: PropTypes.array.isRequired  // alert objects are organized in an array 
    }

    const mapStateToProps = state => ({ // takes new state just updated by the action and dispatch and maps them into props
        alerts: state.alert
    })

export default connect(mapStateToProps)(Alert)  // calls the above function