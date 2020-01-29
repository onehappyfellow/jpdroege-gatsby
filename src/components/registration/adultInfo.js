import React from "react"
import PropTypes from "prop-types"

const AdultInfo = props => {
    const {name, level, weekday, notes} = props.student;
    return (
        <div className="student" data-student={props.studentNumber} >

            <h3>Adult Registration</h3>
            <button type="button" onClick={props.handleDelete} aria-label="remove this student">&times;</button>

            <label>
                Student Name
                <input 
                    type="text"
                    name="adult-name"
                    value={name}
                    placeholder="short answer"
                    onChange={props.handleChange}
                />
            </label>

            <label>
                Korean Level
                <input 
                    type="text"
                    name="adult-level"
                    value={level}
                    placeholder="short answer"
                    onChange={props.handleChange}
                />
            </label>

            <label>
                Class Preference
                <input 
                    type="text"
                    name="adult-weekday"
                    value={weekday}
                    placeholder="Thursday, Friday or Saturday"
                    onChange={props.handleChange}
                />
            </label>

            <label>
                Other Notes
                <textarea 
                    name="adult-notes" 
                    value={notes} 
                    onChange={props.handleChange} 
                    rows="4"
                    placeholder="If you have any comments for us, please leave them here..."
                />
            </label>

        </div>        
    );
}

AdultInfo.propTypes = {
    student: PropTypes.shape({
        level: PropTypes.string.isRequired,
        weekday: PropTypes.string.isRequired,
        notes: PropTypes.string.isRequired,
    }),
    handleChange: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
}

export default AdultInfo;