/**
 * Created by  yangyang11 on 2017/1/13.
 */
import React,{Component} from 'react';
import './myPopup.less';
class MyPopup extends Component{
    constructor(props){
        super(props);
    }
   
    render(){
        return (
        	<div className='Allmore1' style={{display:this.props.moreDisplay}}>
			  		<div className="grayDiv" onClick={this.props.closeMoreYmbotChat}>
			  		</div>
			  		<div className="more1">
			  			<div className="icon2" onClick={this.props.closeMoreYmbotChat}>
			         	   <img src={require('./../../../static/image/ymbot/closeMore.png')} alt={''} style={{display:'block',width:'100%'}}/> 
			    		</div>
			    		<div className="moreOptQuestion">
			    			<div className="icon1">
				    			<img src={require('./../../../static/image/ymbot/moreBot.png')} alt={''} style={{display:'block',width:'100%'}}/> 
				    		</div>
				    		<div className="optQusetion">
				    			<div dangerouslySetInnerHTML={{__html: this.props.question}} />
				    		</div>
			    		</div>
			    		<div className="line" />
			    		<div className="moreOptAnswer">
		 	 				<div dangerouslySetInnerHTML={{__html: this.props.answer}} />
		 				</div>
			  		</div>
			  	</div>
        );
    }
}
module.exports = MyPopup;