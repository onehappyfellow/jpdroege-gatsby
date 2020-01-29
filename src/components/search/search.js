import React from "react"

const Passage = props => {
    return (
        <div>
            <h2>{props.passage.reference}</h2>
            <p>{props.passage.text}</p>
        </div>
    );
}

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            version: "ESV",
            search: "",
            loadingState: "initial",
        }
    }

    handleChange = (event) => {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        let lastSearch = this.state.search;
        this.setState({
            search: "",
            lastSearch,
            loadingState: "loading",
        })

        let lambda = process.env === 'production' ? '/.netlify/functions' : '/localhost:9000'
        fetch(`${lambda}/bible?search=${encodeURIComponent(lastSearch)}&version=${this.state.version}`)
            .then(res => {
                console.log("RESPONSE",res.status)
                if (res.status == 200) {
                    return res.json();
                } else {
                    throw new Error(res);
                }
            })
            .then(passage => {
                this.setState({
                    passage,
                    loadingState: "loaded",
                })
            })
            .catch(err => {
                console.log("ERROR CAUGHT")
                console.error(err);
                let search = this.state.lastSearch;
                this.setState({
                    search,
                    lastSearch: "",
                    loadingState: "error",
                })
            })
    }


    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Search
                        <input 
                            type="text"
                            name="search"
                            value={this.state.search}
                            onChange={this.handleChange}
                            className="input--primary"
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                
                <div className="content">  
                    {{
                        initial: null,
                        loading: <p>Loading...</p>,
                        loaded: <Passage passage={this.state.passage} />,
                        error: <p style={{color:"red"}}>I'm sorry, there's been an error</p>
                    }[this.state.loadingState]}
                </div>
            </div>
        );
    }
}

export default SearchForm;