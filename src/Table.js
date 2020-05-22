/*

cd desktop/coding/coronatable

npm start

*/

import React, { Component } from 'react'
import './App.css';

const API = 'https://api.covid19api.com/';
const DEFAULT_QUERY = 'summary';
var errorResolved = false;

class Table extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }
  sortTable(n){
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("coronatable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
	  if(n==0){
		  if (dir == "asc") {
			if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
			  // If so, mark as a switch and break the loop:
			  shouldSwitch = true;
			  break;
			}
		  } else if (dir == "desc") {
			if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
			  // If so, mark as a switch and break the loop:
			  shouldSwitch = true;
			  break;
			}
		  }
		}
	  else{
		  if (dir == "asc") {
			if (Number(x.innerHTML) > Number(y.innerHTML)) {
			  // If so, mark as a switch and break the loop:
			  shouldSwitch = true;
			  break;
			}
		  } else if (dir == "desc") {
			if (Number(x.innerHTML) < Number(y.innerHTML)) {
			  // If so, mark as a switch and break the loop:
			  shouldSwitch = true;
			  break;
			}
		  }
		}
	}
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  }
  
 fetchApi(){
    fetch(API + DEFAULT_QUERY)
	.then(res => res.json())
	.then(
		(result) => {
		  errorResolved=true;
		  this.setState({
			isLoaded: true,
			items: result.Countries
		  });
		},
		(error) => {
		  this.setState({
			isLoaded: true,
			error
		  });
		}
	)
 }
  componentDidMount() {
	  this.fetchApi();
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
					
					<table style={{border: "1px solid white"}} id="coronatable">
						<tr>
							<th onClick={()=>this.sortTable(0)}>Country</th>
							<th onClick={()=>this.sortTable(1)}>New Confirmed</th> 
							<th onClick={()=>this.sortTable(2)}>Total Confirmed</th>
							<th onClick={()=>this.sortTable(3)}>New Deaths</th>
							<th onClick={()=>this.sortTable(4)}>Total Deaths</th>
							<th onClick={()=>this.sortTable(5)}>New Recovered</th>
							<th onClick={()=>this.sortTable(6)}>Total Recovered</th>
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
