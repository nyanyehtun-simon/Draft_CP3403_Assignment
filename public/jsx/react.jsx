//import * as naive from "./naive_algorithm"
//import { getValueInput, filterNames } from './filters.js';

// Create a ES6 class component
class Person extends React.Component {

    constructor() {
        super();
        this.state = {data: []}
    }

    componentDidMount() {
        fetch('/fetch-data-numeric')
            .then(res => {
                //console.log(res);
                return res.json()
            })
            .then(data => {
                //console.log(data);
                this.setState({data: JSON.parse(data)});
                getValueInput("Hungggggggggg");
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

        /*TODO: Cac buoc tao mot cai plot:
        * tao list of key: ok
        * tao mot list chua toan so: numList[{name & list }]
        * trong tung dict, lay dict[key] --> gan push vao numList
        * render cai numList do bang plot: --> plot dung [array]
        * */

        var listOfKeys ;
        var numlist = [];

        let div = [];

        //get the list of keys:
        this.state.data.forEach(dict => {
            listOfKeys = Object.keys(dict);
        });

        //get values to numlist:
        listOfKeys.forEach((key) => {
            numlist.push({
                keyname: key,
                listOfValue: ((key) => {
                    this.state.data.forEach(dict => {
                        var toReturn = [];
                        toReturn.push(dict[key]);
                        return toReturn;
                    });
                })
            })
        });

        numlist.forEach((element) => {

        });

        div.push(<li>{dict["job"]}</li>);

        return div;

        //console.log('inside populateHTML');
        //console.log(this.state);
    }
}

const element1 = document.getElementById('person1');

// Use the ReactDOM.render to show the component on the browser
ReactDOM.render(
    <Person personNo='1'/>, element1);
