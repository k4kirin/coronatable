import React, { Component } from 'react'
import Author from './Author';
import Table from './Table';
import Header from './Header';
import './App.css';

export default class App extends Component {
	render() {
		return (
			<div>
				<Author/>
				<Header/>
				<Table/>
			</div>
		)
  }

}
