import React from "react"
import ChildInfo from "./childInfo"
import AdultInfo from "./adultInfo"

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "jonathan.droege@gmail.com",
            name: "Jonathan",
            phone: "5055069968",
            addToEmailList: true,
            students: [
                {
                    level: "high",
                    name: "Jonathan",
                    notes: "",
                    price: 9000,
                    type: "adult",
                    weekday: "Saturday",
                }
            ],
            discounts: [],
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
    }

    handleStudentChange = (event) => {
        let key = event.target.name.split("-")[1];
        let n = event.target.parentNode.parentNode.dataset["student"];
        const students = this.state.students;
        students[n][key] = event.target.value;
        this.setState({ students });
    }

    deleteStudent = (event) => {
        let n = event.target.parentNode.dataset["student"];
        const students = this.state.students;
        students.splice(n,1);
        this.setState({ students });
    }

    getMultiStudentDiscount = () => {
        const PERCENT_OFF = .2;
        const students = this.state.students;
        const subtotal = students.reduce((sum, student) => sum + student.price, 0);
        if (students.length > 1) {
            return Math.round(subtotal * PERCENT_OFF);
        }
        return 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const lambdaURL = process.env === 'production' ? '/.netlify/functions' : '/localhost:9000'
        console.log(`preparing POST to ${lambdaURL}`)

        const state = this.state;
        state.subtotal = state.students.reduce((sum, student) => sum + student.price, 0);
        if (this.getMultiStudentDiscount() > 0) {
            state.discounts.push({
                id: "multi-student",
                value: this.getMultiStudentDiscount()
            })
        }
        state.total = state.subtotal - state.discounts.reduce((sum, discount) => sum + discount.value, 0);
        console.log(state);
        
        this.postData(`${lambdaURL}/registration`, state)
            .then(data => {
                console.log("successful registration")
                console.log(data)
                this.setState({
                    email: "",
                    name: "",
                    phone: "",
                    addToEmailList: "",
                    students: [],
                    discounts: [],
                })
            })
            .catch(err => console.error(err))
    }

    postData(url = '', data = {}) {
        return fetch(url, {
            method: 'POST',
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw new Error(response.json())
            }
        });
    }

    createNewChild = () => {
        let students = this.state.students;
        students.push({
            type: "child",
            name: "",
            birthdate: "",
            grade: "",
            allergies: "",
            notes: "",
            price: 7500,
        });
        this.setState({ students });
    }

    createNewAdult = () => {
        let students = this.state.students;
        let name = this.state.name;
        students.push({
            type: "adult",
            name, 
            level: "",
            weekday: "",
            notes: "",
            price: 9000,
        });
        this.setState({ students });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>

                <label>
                    Name
                    <input 
                        type="text"
                        name="name"
                        value={this.state.name}
                        placeholder="short answer"
                        onChange={this.handleChange}
                    />
                </label>
                
                <label>
                    Phone
                    <input 
                        type="phone"
                        name="phone"
                        value={this.state.phone}
                        placeholder="short answer"
                        onChange={this.handleChange}
                    />
                </label>

                <label>
                    Email
                    <input 
                        type="email"
                        name="email"
                        value={this.state.email}
                        placeholder="short answer"
                        onChange={this.handleChange}
                    />
                </label>

                <label>
                    <input name="addToEmailList" type="checkbox" checked={this.state.addToEmailList} onChange={this.handleChange} />
                    {this.state.addToEmailList}
                </label>
                    <p>
                        
                        notify me of future Korean classes and related cultural activities
                        </p>

                { this.state.students.map((student, i) => {
                    return (student.type === "child"
                        ?   <ChildInfo 
                                key={`student${i}`} 
                                studentNumber={i} 
                                student={student} 
                                handleChange={this.handleStudentChange} 
                                handleDelete={this.deleteStudent}
                            />
                        :   <AdultInfo 
                                key={`student${i}`} 
                                studentNumber={i} 
                                student={student} 
                                handleChange={this.handleStudentChange} 
                                handleDelete={this.deleteStudent}
                            />
                    );
                })}
                
                <button type="button" onClick={this.createNewChild}>Add Child</button>
                <button type="button" onClick={this.createNewAdult}>Add Adult</button>

                <p>Subtotal: 
                    { this.state.students.reduce((sum, student) => sum + student.price, 0) }
                </p>
                <p>Discounts:
                    { this.getMultiStudentDiscount() }
                </p>
                <p>Total: 
                    { this.state.students.reduce((sum, student) => sum + student.price, 0) - this.getMultiStudentDiscount() }
                </p>

                <input type="submit" disabled={this.state.students.length === 0} value="Submit" />
            </form>
        );
    }

    // CSS
    // add level test modal
    
}

export default RegistrationForm;