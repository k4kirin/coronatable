/*

cd desktop/coding/coronatable

npm start

git add .

git commit

git push origin master

*/

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
      items: [],
	  curCol: 0,
    };
  }
  compare(n,first,second){
		var table = document.getElementById("coronatable");
		var rows = table.rows;
		var prevRow = rows[first].getElementsByTagName("TD")[n];
		var curRow = rows[second].getElementsByTagName("TD")[n];
		var x,y;
		if(n == 0){
			x = prevRow.innerHTML.localeCompare(curRow.innerHTML);
			y = 0;
		}
		else{
			x = Number(prevRow.innerHTML);
			y = Number(curRow.innerHTML);
		}
		return x<y;
	}
  sortTable(n,start,end){
	if(end==start)return;
	var i;
	var table = document.getElementById("coronatable");
	var rows = table.rows;
	var newStart = Number(start);
	var sorted = true;
	for(i = start+1;i<end;i++){
		if(this.compare(n,i-1,i)){
			sorted = false;
			break;
		}
	}
	if(sorted){
		if(start==1 && end==table.rows.length){
			for(i=2;i<table.rows.length;i++){
				rows[1].parentNode.insertBefore(rows[i], rows[1]);
			}
		}
		return;
	}
	for (i = start+1;i < end;i++){
		if(this.compare(n,newStart,i)){
			rows[start].parentNode.insertBefore(rows[i], rows[start]);
			newStart++;
		}
	}
	console.log(newStart,start,end);
	this.sortTable(n,start,newStart);
	this.sortTable(n,newStart+1,end);
  }
  
 fetchApi(){
    fetch(API + DEFAULT_QUERY)
	.then(res => res.json())
	.then(
		(result) => {
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
							<th onClick={()=>this.sortTable(0,1,document.getElementById("coronatable").rows.length)}>Country</th>
							<th onClick={()=>this.sortTable(1,1,document.getElementById("coronatable").rows.length)}>New Confirmed</th> 
							<th onClick={()=>this.sortTable(2,1,document.getElementById("coronatable").rows.length)}>Total Confirmed</th>
							<th onClick={()=>this.sortTable(3,1,document.getElementById("coronatable").rows.length)}>New Deaths</th>
							<th onClick={()=>this.sortTable(4,1,document.getElementById("coronatable").rows.length)}>Total Deaths</th>
							<th onClick={()=>this.sortTable(5,1,document.getElementById("coronatable").rows.length)}>New Recovered</th>
							<th onClick={()=>this.sortTable(6,1,document.getElementById("coronatable").rows.length)}>Total Recovered</th>
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
