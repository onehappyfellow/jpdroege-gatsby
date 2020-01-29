import React from "react"
import PropTypes from "prop-types"

const ChildInfo = props => {
    const {name, birthdate, grade, allergies, notes} = props.student;
    return (
        <div className="student" data-student={props.studentNumber} >

            <h3>Child Registration</h3>
            <button type="button" onClick={props.handleDelete} aria-label="remove this student">&times;</button>

            <label>
                Student Name
                <input 
                    type="text"
                    name="child-name"
                    value={name}
                    placeholder="short answer"
                    onChange={props.handleChange}
                />
            </label>

            <label>
                Birthdate
                <input 
                    type="text"
                    name="child-birthdate"
                    value={birthdate}
                    placeholder="short answer"
                    onChange={props.handleChange}
                />
            </label>

            <label>
                School Grade
                <input 
                    type="text"
                    name="child-grade"
                    value={grade}
                    placeholder="short answer"
                    onChange={props.handleChange}
                />
            </label>

            <label>
                Allergies
                <input 
                    type="text"
                    name="child-allergies"
                    value={allergies}
                    placeholder="short answer"
                    onChange={props.handleChange}
                />
            </label>

            <label>
                Other Notes
                <textarea 
                    name="child-notes" 
                    value={notes} 
                    onChange={props.handleChange} 
                    rows="4"
                    placeholder="If you have any comments for us, please leave them here..."
                />
            </label>
        </div>
    );
}

ChildInfo.propTypes = {
    student: PropTypes.shape({
        name: PropTypes.string.isRequired,
        birthdate: PropTypes.string.isRequired,
        grade: PropTypes.string.isRequired,
        allergies: PropTypes.string.isRequired,
        notes: PropTypes.string.isRequired,
    }),
    handleDelete: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
}

export default ChildInfo;