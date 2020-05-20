import React from 'react';
import './App.css';
/*
cd desktop/coding stuff/react/imgiftmaker

npm start

cd desktop/coding stuff/react/imgiftmaker
npm run deploy
git add .
git commit -m "Version 1.3.1"
git push origin master

*/
function importAll(r) {
  let img = {};
  r.keys().map((item, index) => { img[item.replace('./', '')] = r(item); });
  return img;
}
const img = importAll(require.context('./res', false, /\.(png|jpe?g|svg)$/));

function Square(props) {
  return (
    <button
		className="square"
		onClick={props.onClick}
		style={
			{backgroundColor:props.selected?'#d3d3d3':'white'}
		}
	>
      {props.name}
    </button>
  );
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(props.names.length).fill(true,0,1).fill(false,1,props.names.length),
	  names: props.names,
	  options: props.options,
	  onChange: props.onChange,
    };
  }
  
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (squares[i]) return;
	squares.fill(false);
    squares[i] = true;
	this.props.onChange(this.state.options,this.state.names[i]);
    this.setState({
      squares: squares,
    });
  }

  renderSquare(i) {
    return (
      <Square
        selected={this.state.squares[i]}
		name={this.state.names[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
  
  render(){
	var results=[];
	for (var i=0;i<this.state.names.length;i++){
		results.push(this.renderSquare(i));
		// if(i%3==2)
			// results.push(<br/>);
	}
	  return(
		<div>
			{results}
		</div>
		);
  }
}
class Editor extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div>
				
			</div>
		);
	}
}
  
export default props => 
<div className="App">
	<body>
		<Editor />
	</body>
</div>
/* debug variables
{`Boolean Value: ${this.state.rotateResult}`}
{`Boolean Value: ${this.state.rotateUpload}`}
{this.uploadNumber}
{this.displayImage.length}
{this.state.options.type}
{this.state.options.language}
{this.state.options.top}
{this.state.options.bot}
{this.state.options.txt}
{this.imgName.topName}
{this.imgName.botName}
{this.imgName.txtName}
*/