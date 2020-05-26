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
	  sortBy: 0, //0=ascending
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
	
	if(start==2 && end==table.rows.length){
		this.setState({
			curCol: n,
			sortBy: 1,
		});
	}
	for(i = start+1;i<end;i++){
		if(this.compare(n,i-1,i)){
			sorted = false;
			break;
		}
	}
	if(sorted){
		if(start==2 && end==table.rows.length){
			for(i=3;i<table.rows.length;i++){
				rows[2].parentNode.insertBefore(rows[i], rows[2]);
			}
			this.setState({
				sortBy: 1-this.state.sortBy,
			});
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
  arrow(n){
	  if(this.state.curCol == n){
		  if(this.state.sortBy == 1)
			  return "▼";
		  else
			  return "▲";
	  }
  }
  dateParse(str){
	  return str.substring(0,10)+" "+str.substring(12,19)+" GMT";
  }
	render() {
		const { error, isLoaded, items } = this.state;
		if (error) {
			window.location.reload()
			return <div>Reloading. Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
				Last updated: {this.dateParse(items[0].Date)}
					<table style={{border: "1px solid white"}} id="coronatable">
						<tr>
							<th class="sortheader" onClick={()=>this.sortTable(0,2,document.getElementById("coronatable").rows.length)}>Country</th>
							<th class="sortheader" onClick={()=>this.sortTable(1,2,document.getElementById("coronatable").rows.length)}>New Confirmed</th>
							<th class="sortheader" onClick={()=>this.sortTable(2,2,document.getElementById("coronatable").rows.length)}>Total Confirmed</th>
							<th class="sortheader" onClick={()=>this.sortTable(3,2,document.getElementById("coronatable").rows.length)}>New Deaths</th>
							<th class="sortheader" onClick={()=>this.sortTable(4,2,document.getElementById("coronatable").rows.length)}>Total Deaths</th>
							<th class="sortheader" onClick={()=>this.sortTable(5,2,document.getElementById("coronatable").rows.length)}>New Recovered</th>
							<th class="sortheader" onClick={()=>this.sortTable(6,2,document.getElementById("coronatable").rows.length)}>Total Recovered</th>
						</tr>
						<tr>
							<th class="sortheader" onClick={()=>this.sortTable(0,2,document.getElementById("coronatable").rows.length)}>{this.arrow(0)}</th>
							<th class="sortheader" onClick={()=>this.sortTable(1,2,document.getElementById("coronatable").rows.length)}>{this.arrow(1)}</th>
							<th class="sortheader" onClick={()=>this.sortTable(2,2,document.getElementById("coronatable").rows.length)}>{this.arrow(2)}</th>
							<th class="sortheader" onClick={()=>this.sortTable(3,2,document.getElementById("coronatable").rows.length)}>{this.arrow(3)}</th>
							<th class="sortheader" onClick={()=>this.sortTable(4,2,document.getElementById("coronatable").rows.length)}>{this.arrow(4)}</th>
							<th class="sortheader" onClick={()=>this.sortTable(5,2,document.getElementById("coronatable").rows.length)}>{this.arrow(5)}</th>
							<th class="sortheader" onClick={()=>this.sortTable(6,2,document.getElementById("coronatable").rows.length)}>{this.arrow(6)}</th>
						</tr>
						{items.map(items =>        
								<tr class="sortrow">
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
