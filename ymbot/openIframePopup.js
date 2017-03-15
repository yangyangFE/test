/**
 * Created by  yangyang11 on 2017/1/13.
 */
import React,{Component} from 'react';
import { Popup , NavBar} from 'antd-mobile';
import './openIframePopup.less';
class OpenIframePopup extends Component{
    constructor(props){
        super(props);
          this.closePopup= this.closePopup.bind(this);
          this.setNniqueID= this.setNniqueID.bind(this);
    }
   	closePopup(){
		Popup.hide();
	}
   	/*
   	 * set a unique key for DOM node
   	 * @return {Number} 
   	 */
   	setNniqueID() {
	    function s4(){
	        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	    }
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	            s4() + '-' + s4() + s4() + s4();
	}
    render(){
    	let listUrl = this.props.url;
    	//listUrl ='http://news.163.com/';
		let height1=window.innerHeight;
		let h1 = height1 - 44;
        return (
        	<div key={this.setNniqueID} className="iframePopup" style={{height:height1}} >
			    <div className='navbar'>
           			<NavBar leftContent="" mode="light" onLeftClick={() => this.closePopup()}
           				rightContent={''}
          				></NavBar>
         		</div>
         		
			    <div className='frame' style={{height:h1}}>   
				    <iframe src={listUrl} width='100%' height='100%' frameBorder="0">								
			   		 </iframe>
		   		</div>
			  </div>
        );
    }
}
module.exports = OpenIframePopup;