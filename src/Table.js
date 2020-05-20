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
		super(props);
		this.handleChange=this.handleChange.bind(this);
		this.handleImageUpload=this.handleImageUpload.bind(this);
		this.handleImageUploadBehind=this.handleImageUploadBehind.bind(this);
		this.handleRotateResult=this.handleRotateResult.bind(this);
		this.handleRotateUpload=this.handleRotateUpload.bind(this);
		this.handleRefresh=this.handleRefresh.bind(this);
		this.handleSave=this.handleSave.bind(this);
		this.displayImage=[];
		this.imgName={
			topName: "",
			botName: "",
			txtName: "",
			wtrName: "",
		};
		this.rotatedResult=true;
		this.refreshed=false;
		this.uploadNumber=[];
		this.canvasData = "";
		this.state={
			file: null,
			imagePreviewUrl: null,
			fileBehind: null,
			imagePreviewUrlBehind: null,
			rotateResult: false,
			rotateUpload: false,
			options: {
				type: "Force I",
				language: "English",
				top: "Yes",
				bot: "Yes",
				txt: "Yes",
			},
		};
	}
	imagePusher(){
		var createImage = function(src) {
		  var tempImg   = new Image();
		  tempImg.src   = src;
		  return tempImg; 
		};
		var count = 0;
		this.displayImage = [];
		this.uploadNumber = [];
		if(this.state.imagePreviewUrlBehind){
			this.displayImage.push(createImage(this.state.imagePreviewUrlBehind));
			this.uploadNumber.push(count);
			count++;
		}
		if(this.imgName.topName){
			if(this.state.options.top[0]=="B"){
				this.displayImage.push(createImage(img[this.imgName.topName]));
				count++;
			}
		}
		if(this.imgName.botName){
			if(this.state.options.bot[0]=="B"){
				this.displayImage.push(createImage(img[this.imgName.botName]));
				count++;
			}
		}
		if(this.state.imagePreviewUrl){
			this.displayImage.push(createImage(this.state.imagePreviewUrl));
			this.uploadNumber.push(count);
			count++;
		}
		if(this.imgName.txtName){
			this.displayImage.push(createImage(img[this.imgName.txtName]));
			count++;
		}
		if(this.imgName.topName){
			if(this.state.options.top[0]!="B"){
				this.displayImage.push(createImage(img[this.imgName.topName]));
				count++;
			}
		}
		if(this.imgName.botName){
			if(this.state.options.bot[0]!="B"){
				this.displayImage.push(createImage(img[this.imgName.botName]));
				count++;
			}
		}
		this.displayImage.push(createImage(img[this.imgName.wtrName]));
	}
	stackImages(cardCanvas,ctx,i){
		var width, height;
		const isI = (element) => element == i;
		width=this.state.rotateResult?cardCanvas.height:cardCanvas.width;
		height=this.state.rotateResult?cardCanvas.width:cardCanvas.height;
		if(this.state.rotateUpload && this.uploadNumber.some(isI)){
			ctx.rotate(-90*Math.PI/180);
			ctx.translate(this.state.rotateResult?-cardCanvas.width:-cardCanvas.height,0);
			width=this.state.rotateResult?cardCanvas.width:cardCanvas.height;
			height=this.state.rotateResult?cardCanvas.height:cardCanvas.width;
		}
		var thisImage = this.displayImage[i];
		new Promise( (resolve,reject) => {
			thisImage.onload = () => {
				ctx.drawImage(thisImage, 0, 0, width, height);
			   if (i==this.displayImage.length-1){
					this.canvasData = cardCanvas.toDataURL("image/png");
			   }
			   if(this.state.rotateUpload && this.uploadNumber.some(isI)){
					ctx.translate(this.state.rotateResult?cardCanvas.width:cardCanvas.height,0);
					ctx.rotate(90*Math.PI/180);
				}
				resolve();
			};
		}).then( () => {
		   if(i<this.displayImage.length-1)
			   this.stackImages(cardCanvas,ctx,i+1);
		})
	}
	updateImgName(){
		var keys=Object.keys(this.imgName);
		const imgName = JSON.parse(JSON.stringify(this.imgName));
		for (const key of keys) {
			var totalStr="";
			if(key!=="wtrName"){
				var typeLetter=this.state.options.type.substring(0,1).toLowerCase();
				totalStr+=typeLetter;
			}
			var oneNotTwo = this.state.options.type[this.state.options.type.length-1]!=this.state.options.type[this.state.options.type.length-2];
			totalStr+=oneNotTwo?"1":"2";
			var langLetter=this.state.options.language.substring(0,1).toLowerCase();
			if(key==="topName") langLetter="";
			totalStr+=langLetter;
			if(key!=="wtrName" && this.state.options[key.substring(0,3)]==="No"){
				totalStr="";
			}
			else{
				totalStr+=key.substring(0,3)+'.png';
			}
			imgName[key]=totalStr;
			
		}
		this.imgName = imgName;
	}
	updateCanvas(){
			this.refreshed = false;
		const cardCanvas=this.refs.cardCanvas;
		const ctx=cardCanvas.getContext("2d");
		this.imagePusher();
		ctx.clearRect(0, 0, 510, 510);
		if(!this.rotatedResult){
			var temp=cardCanvas.height;
			cardCanvas.height=cardCanvas.width;
			cardCanvas.width=temp;
			this.rotatedResult=true;
			var ch=cardCanvas.height;
			var cw=cardCanvas.width;
			var rotateValue=90*Math.PI/180;
			if(this.state.rotateResult){
				ctx.translate(cw, 0);
				ctx.rotate(rotateValue);
			}
		}
		this.stackImages(cardCanvas,ctx,0);
	}
	updateEditor(){
		this.updateImgName();
		this.updateCanvas();
	}
	componentWillMount(){
		this.updateImgName();
	}
	componentDidMount(){
		this.updateCanvas();
		
	fetch('https://api.covid19api.com/summary')
	.then(results => {
		return results.json();
	}).then()
	}
	componentDidUpdate(prevProps, prevState){
		if(this.state.options!=prevState.options
			||this.state.imagePreviewUrl!=prevState.imagePreviewUrl
			||this.state.imagePreviewUrlBehind!=prevState.imagePreviewUrlBehind
			||this.state.rotateResult!=prevState.rotateResult
			||this.state.rotateUpload!=prevState.rotateUpload){
			this.updateEditor();
		}
	}
	handleChange(opt,name){
		const options = JSON.parse(JSON.stringify(this.state.options));
		options[opt]=name;
		this.setState({options: options});
	}
	handleImageUpload(uploaded) {
		uploaded.preventDefault();

		let reader = new FileReader();
		let file = uploaded.target.files[0];

		reader.onloadend = () => {
		  this.setState({
			file: file,
			imagePreviewUrl: reader.result
		  });
		}
		
		reader.readAsDataURL(file);
	}
	handleImageUploadBehind(uploaded) {
		uploaded.preventDefault();

		let reader = new FileReader();
		let file = uploaded.target.files[0];

		reader.onloadend = () => {
		  this.setState({
			fileBehind: file,
			imagePreviewUrlBehind: reader.result
		  });
		}
		
		reader.readAsDataURL(file);
	}
	handleRotateResult(){
		var opposite = !this.state.rotateResult;
		this.rotatedResult=false;
		this.setState({
			rotateResult: opposite,
		});
	}
	handleRotateUpload(){
		var opposite = !this.state.rotateUpload;
		this.setState({
			rotateUpload: opposite,
		});

	}
	handleRefresh(){
		this.updateEditor();
		this.refreshed = true;
	}
	handleSave(){
		if(this.refreshed){
			window.location.href=this.canvasData;
		}
		else
			this.handleRefresh();
	}
	renderBoard(namesArray,opt){
		return(
			<Board
				names={namesArray}
				options={opt}
				onChange={this.handleChange}
			/>
		);
	}
	render(){
		return(
			<div>
				<b>Select your Gift type:</b>
				<br/>
				{this.renderBoard(["Force I","Force II","Accel I","Accel II","Protect I","Protect II"],"type")}
				<b>Select card language:</b>
				<br/>
				{this.renderBoard(["English","Japanese"],"language")}
				<b>Select additional options:</b>
				<br/>
				<div id="hori-box">
					<div id="row-box">
						Top border:
						{this.renderBoard(["Yes","Behind image","No"],"top")}
					</div>&nbsp;
					<div id="row-box">
						Bottom border:
						{this.renderBoard(["Yes","Behind image","No"],"bot")}
					</div>&nbsp;
					<div id="row-box">
						Card text:
						{this.renderBoard(["Yes","No"],"txt")}
					</div>
				</div>
				<small><b>Hint</b>: use "Behind image" when you put a tranparent image in front!</small>
				<br/>
				<b>Upload your image in front here: &nbsp;</b>
				<input type="file" name="pic" accept="image/*" onChange={this.handleImageUpload}/>
				<br/>
				<b>Upload your image behind here: &nbsp;</b>
				<input type="file" name="pic" accept="image/*" onChange={this.handleImageUploadBehind}/>
				<br/>
				<small><b>Hint</b>: only upload an image behind when you put a tranparent image in front!</small>
				<br/>
				<Square name="Rotate upload" onClick={this.handleRotateUpload}/>
				&nbsp;&nbsp;&nbsp;
				<Square name="Rotate result" onClick={this.handleRotateResult}/>
				<br/>
				<Square name="Refresh" onClick={this.handleRefresh}/>
				&nbsp;&nbsp;&nbsp;← Press refresh if image not loaded properly!
				<br/>
				<b>Result:</b>
				<br/>
				<Square name="Save" onClick={this.handleSave}/>
				&nbsp;&nbsp;&nbsp;← Will refresh for you if you haven't!
					<br/>
					<br/>
					<div id="canvas-container">
						<canvas
							ref="cardCanvas"
							width="350"
							height="510"
						/>
					</div>
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