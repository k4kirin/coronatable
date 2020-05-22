import React, { Component } from 'react'
import Table from './Table';
import Header from './Header';
import './App.css';

export default class App extends Component {
	render() {
		return (
			<div>
				<Header/>
				<Table/>
			</div>
		)
  }

}
