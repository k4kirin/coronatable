import React, { Component } from 'react'
import './App.css';

const API = 'https://api.covid19api.com/';
const DEFAULT_QUERY = 'summary';

class Table extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }
 
  componentDidMount() {
    fetch(API + DEFAULT_QUERY)
	.then(res => res.json())
	.then(
		(result) => {
		  this.setState({
			isLoaded: true,
			items: result.Countries
		  });
		},
		// Note: it's important to handle errors here
		// instead of a catch() block so that we don't swallow
		// exceptions from actual bugs in components.
		(error) => {
		  this.setState({
			isLoaded: true,
			error
		  });
		}
	)
  }
  
  
	render() {
		const { error, isLoaded, items } = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
					<header className="App-header">
						<h1>COVID-19 Table</h1>
					</header>
					
					<table style={{border: "1px solid white"}}>
						<tr>
							<th>Country</th>
							<th>New Confirmed</th> 
							<th>Total Confirmed</th>
							<th>New Deaths</th>
							<th>Total Deaths</th>
							<th>New Recovered</th>
							<th>Total Recovered</th>
						</tr>
						{items.map(items =>        
								<tr>
									<td>{items.Country}</td>
									<td>{items.NewConfirmed}</td>
									<td>{items.TotalConfirmed}</td>
									<td>{items.NewDeaths}</td>
									<td>{items.TotalDeaths}</td>
									<td>{items.NewRecovered}</td>
									<td>{items.TotalRecovered}</td>
								</tr>
						)}
					</table>
				</div>
			);
		}
  }

}

export default Table;
