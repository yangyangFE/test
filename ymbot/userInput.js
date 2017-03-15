/**
 * Created by  yangyang11 on 2017/1/13.
 */
import React,{Component} from 'react';
import { createForm } from 'rc-form';
import {Toast} from 'antd-mobile';
import AJAX from '../../../util/ajax';
import './userInput.css';
var inputQuestion = [];
var initButtonDivStyle= {
	float:'left',
	width:'14.13%',
	height:'0.66rem',
	margin:'0.18rem 0.1rem 0.14rem 0.2rem',
	border:'#c0c0c0 solid 0.02rem',
	borderRadius:'0.08rem',
	cursor:'pointer',
	backgroundColor:'#fff',
	}
var buttonDivStyle= {
	float:'left',
	width:'14.13%',
	height:'0.66rem',
	margin:'0.18rem 0.1rem 0.14rem 0.2rem',
	border:'#1baede solid 0.02rem',
	borderRadius:'0.08rem',
	cursor:'pointer',
	backgroundColor:'#fff',
	}
var initDButton = {
	paddingTop:'0.17rem',
	textAlign:'center',
	fontSize:'0.28rem',
	fontFamily:'PingFang SC Medium',
	color:'#a9a9a9',
	}
var dButton={
	paddingTop:'0.17rem',
	textAlign:'center',
	fontSize:'0.28rem',
	fontFamily:'PingFang SC Medium',
	color:'#1baede',
	}
class UserInput extends Component{
    constructor(props){
        super(props);
		this.state={			
			buttonDiv:initButtonDivStyle,
			dbutton:initDButton,
		};
        this.submitUserAsking=this.submitUserAsking.bind(this);
		this.handleClick=this.handleClick.bind(this);		
		this.clearInput = this.clearInput.bind(this);	
		this.changeInputStyle = this.changeInputStyle.bind(this);	
		this.handleKeydown = this.handleKeydown.bind(this);
    }
    
    /**
     * 点击发送按钮，提交用户输入
     */
	
	submitUserAsking(){
		document.getElementById("user_input").focus();//点击发送，input框获得焦点，虚拟键盘不消失
		let { getFieldProps } = this.props.form;
        let question=getFieldProps('userinput')['value'];//读用户输入           
		if(question){
			let data ={"code":100,"question":question};	        
	        this.handleClick(question);
			this.clearInput();
			this.setState({
        		buttonDiv:initButtonDivStyle,
				dbutton:initDButton,
        	})
		  }
		  else {
		  	Toast.info('请输入您的问题',2);
		  }   
	}
	
	
	/**
	 * send message with AJAX
	 * @param {String}  userInput or clicked Button value 
	 *  
	 */
	// TODO 待加入消息长时间未返回的处理 
	handleClick(question){
	    inputQuestion.push(question);
	    let lastQu = inputQuestion.length-1;
//	    if(inputQuestion[lastQu]==question){
//	    	Toast.offline('这个问题你刚刚问过了', 2, () => {
//      });                    
//	    }else{
		    let toHrDisplayNone='none';//用于控制向hr反馈按钮的显示与隐藏
		    let data ={"code":100,"question":question};
		    let waitDisplay='';
			this.props.changeYmbotState(data,toHrDisplayNone,waitDisplay);
	//		console.log(AjaxQuestion);
			let data1 ={"code":123,"question":'正在输入...'};
			this.props.changeYmbotState(data1,'');
			//待加入超时操作
	//		Toast.loading('请稍候...', 10, () => {
	//      });                                       
	        let param = {"info":question,"sys":null};
		    let func=(data)=>{
				let toHrDisplay='';
				let waitDisplayNone = 'none';
				data.question = question;
				this.props.changeYmbotState(data,toHrDisplay,waitDisplayNone);
	//			Toast.hide();
	        }
	        AJAX.iget("robot/ask",param,func);
//     }
	}

  	//点击发送，清空输入框
    clearInput(){
    	let { getFieldProps } = this.props.form;
        this.props.form.setFieldsValue({
        userinput: '',});
    }
    
    
    //输入内容，改变输入框样式
    changeInputStyle(){
//  	let { getFieldProps } = this.props.form;
//      let question=getFieldProps('userinput')['value'];
        let question = document.getElementById("user_input").value;
        if(question){
        	this.setState({
        		buttonDiv:buttonDivStyle,
				dbutton:dButton,
        	})
        }else{
        	this.setState({
        		buttonDiv:initButtonDivStyle,
				dbutton:initDButton,
        	})
        }
    }
    componentDidMount() {
  		 window.addEventListener('keydown', this.handleKeydown)
	}
    handleKeydown(e){
    	if(e.keyCode === 13){
    	this.submitUserAsking();
    	}
    }
  	render() {
		const { getFieldProps } = this.props.form;
        return (
            <div className="container">
			  <div className="container-wrap" >
					    <div className="scrollTab">
					      <div 
					      onClick={() => this.handleClick('入职报到')}
					      >
					      	<span className="scrollSpan">入职报到</span>
					      </div>
					    </div>
 						<div className="scrollTab">
	 					    <div 
	 					    onClick={() => this.handleClick('今天有什么新闻')}
	 					    >
	 					      <span className="scrollSpan">新闻</span>
	 					      </div>
	 					</div>
  						<div className="scrollTab">
  							 <div 
  							 onClick={() => this.handleClick('公积金支取')}
  							 >
  							 	<span className="scrollSpan">公积金</span>
	 					</div>
 					    </div>
						<div className="scrollTab">
 					      <div 
 					      onClick={() => this.handleClick('开证明')}
 					      >
 					      	<span className="scrollSpan">开证明</span>
 					      </div>
					    </div>
				  </div>

			    <div className="allInput">
				   <div className="inputDiv">
				       <form>
				       <input type ="text" style={{display:'none'}}/>
				       <input  id = 'user_input' type='text' style={{height:'0.45rem',paddingLeft:'0.1rem',width:'90%',paddingTop:'0.1rem',border:'none',WebkitAppearance: 'none',fontSize:'0.34rem',fontFamily:'PingFang SC Medium',color:'#343434',backgroundColor:'transparent'}}  ref="theInput" placeholder=" 亲，有什么想要问我的吗？"
	      					{...getFieldProps('userinput')} 
	      					onInput={() => this.changeInputStyle()} 
	      					onKeyPress = {this.handleKeydown}
	      				/>
	      				</form>
				    </div>
				    <div style={this.state.buttonDiv}>
				      <div 
				      onClick={this.submitUserAsking} 
				      style={this.state.dbutton}
				      >
				      	发送
				      </div>
				    </div>
			  	</div>
			</div>
        );
    }
}


UserInput = createForm()(UserInput);
module.exports = UserInput;