import React from 'react'

class EmailListSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    handleChange = (event) => {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const lambdaURL = process.env === 'production' ? '/.netlify/functions' : '/localhost:9000'
        console.log(`preparing POST to ${lambdaURL}`)

        fetch(`${lambdaURL}/newsletter`, {
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
            body: JSON.stringify({email: this.state.email}),
        }).then(response => {
            console.log(response)
            if (response.status === 200) {
                console.log("successfully subscribed")
                this.setState({email: ""})
            } else {
                throw new Error(response.json())
            }
        }).catch(err => {
            console.error(err)
        })        
    }
    
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Receive periodic updates
                    <input 
                        type="email"
                        name="email"
                        value={this.state.email}
                        placeholder="Your email..."
                        onChange={this.handleChange}
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}

export default EmailListSignup