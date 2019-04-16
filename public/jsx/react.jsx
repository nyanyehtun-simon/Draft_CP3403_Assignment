// Create a ES6 class component
class Person extends React.Component {

    constructor() {
        super();
        this.state = {data: []}
    }

    componentDidMount() {
        fetch('/fetch-data')
            .then(res => {
                console.log(res);
                return res.json()
            })
            .then(data => {
                console.log(data);
                this.setState({data: JSON.parse(data)})
            })
    };

    // Use the render function to return JSX component
    render() {
        return (
            <div className="person-info">
                <h3>Person {this.props.personNo}:</h3>
                <ul>
                    {this.populateDataInHtml()}
                    {/*<li>First Name: {this.props.firstName}</li>*/}
                    {/*<li>Last Name: {this.props.lastName}</li>*/}
                </ul>
            </div>
        );
    }

    populateDataInHtml() {
        let li = [];
        this.state.data.forEach(instance => {
            console.log(instance);
          li.push(<li>{instance.job}</li>)
        });
        return li;

        //console.log('inside populateHTML');
        //console.log(this.state);
    }
}

const element1 = document.getElementById('person1');
//const element2 = document.getElementById('person2');

setTimeout(() => {
    // Use the ReactDOM.render to show your component on the browser
    ReactDOM.render(
        <Person personNo='1' />, element1
    )

// Use the ReactDOM.render to show your component on the browser
//     ReactDOM.render(
//         <Person personNo='2' firstName='Htun' lastName='Nyan'/>, element2
//     )
}, 10000);
