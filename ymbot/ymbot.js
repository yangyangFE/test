/**
 * Created by  yangyang11 on 2017/1/13.
 */
import React,{Component} from 'react';
import Context from '../../../util/context';
import {Popup, NavBar} from 'antd-mobile';
import FeedbackForm from '../feedback/feedbackForm';
import NavBar1 from './navbar';
import UserInput from './userInput';
import Content from './content';
import MyPopup from './myPopup';
import './ymbot.css';
var alldata;
var initBodyHeight = window.innerHeight;;
var virtualBodyHeight;
var historyChat = [];
class Ymbot extends Component{
    constructor(props){
        super(props);
        this.state = {
			dialogs:[],
			fadetoHrDisplay:'',
			waitDisplay:[],
			toHrHeight:'',
			moreDisplay:'none',
			question:'',
			answer:'',
		}
        this.changeChatContent = this.changeChatContent.bind(this);
        this.openMoreYmbotChat = this.openMoreYmbotChat.bind(this);
        this.closeMoreYmbotChat = this.closeMoreYmbotChat.bind(this);
    }
    /**
     * 当机器人回答的消息中字数超过150个时，只显示150字，并且在聊天框最后面打开一个查看详情按钮，点击弹出此弹出层
     * @param  {String} question 用户输入
     * @param {String}  answer 机器人返回的text里的所有内容
     */
    openMoreYmbotChat(question,answer){
    	this.setState({
			moreDisplay:'',
			question:question,
			answer:answer,
		})
    }
    /**
     * 点击关闭展开详情弹出层
     */
    closeMoreYmbotChat(){
    	this.setState({
			moreDisplay:'none',
		})
    }
    /**
     * 从input组件里接受用户输入，追加到此组件state的dialogs数组里，
     * 然后将dialogs数组通过props传给Content组建，
     * 由content组建负责渲染dom表
     * @param  {Object} data "code":100代表为用户输入，code 123为"正在输入"，code 10000等为机器人返回的值 question是具体内容
     * @param {String}  toHrDisplay 通过props传给Content组件，用于控制向hr反馈只在聊天内容最底部显示
     * @param {String} waitDisplay1 为更好得与用户互动，在用户向机器人发送内容后，机器人在未返回消息时显示正在输入，返回内容后替代正在输入
     */ 
   changeChatContent(data,toHrDisplay,waitDisplay1){
		 //为实现本地只保存后50调消息，因此用js模拟队列，实现先进先出
		 //如果返回null，就不把数据展示出来
		if(data){
			this.state.dialogs.unshift(data);
		}
		let newDialogs = this.state.dialogs;
		let userContext=Context.getUserinfo();
		let userCode = userContext.u_usercode;
		let staffid = userContext.u_staffid;
//		let historyMessage=JSON.parse(localStorage.getItem(userCode));
//	    console.log(historyMessage);
//		if(historyMessage.staffid == staffid){
//			historyMessage.chat.unshift(data);
//			if(historyMessage.chat.length>75){
//			    historyMessage.chat.pop();	
//			}
//		}
//		let userChatMessage = {'staffid':staffid,'chat':historyMessage};
//		userChatMessage = JSON.stringify(userChatMessage);
//		localStorage.setItem(userCode,userChatMessage);
		let historyMessage=JSON.parse(localStorage.getItem(userCode));
		if (historyMessage){
			historyChat = historyMessage.chat;
		}
		//如果ajax请求返回的data为null，就不存进localStorage
		if(data){
			historyChat.unshift(data)
		}
		if(historyChat.length > 75){
			historyChat.pop();
		}
		//console.log(historyChat.length);
		let userChatMessage = {'staffid':staffid,'chat':historyChat};
		userChatMessage = JSON.stringify(userChatMessage);
		localStorage.setItem(userCode,userChatMessage);
		
		
		this.state.waitDisplay.unshift(waitDisplay1);
		let newWaitDisplay = this.state.waitDisplay;
		for (let i =newWaitDisplay.length;i>=0;i--){
			newWaitDisplay[i]='none';
		}
		newWaitDisplay[0]="";
		this.setState({
			dialogs:newDialogs,
			fadetoHrDisplay:toHrDisplay,
			waitDisplay:newWaitDisplay,
		})
	}
   /**
    * 安卓手机上，resize监听虚拟键盘弹出，强制重新渲染dom，解决虚拟键盘遮盖聊天记录的问题
    */
   // TODO 安卓交互上体验不是很好，后期需要优化，由于键盘瞬间消失，而react的异步渲染dom需要时间，导致键盘消失后，键盘处会有1s左右的空白
    componentDidMount(){
    	
    	window.onresize=function(){
    		
				this.setState({
					toHrHeight:'',
			})
		}.bind(this)  //让this指向的是当前组件
    }
//	componentDidUpdate(){
//		window.onresize=function(){
//				this.setState({
//					toHrHeight:'',
//			})
//		}.bind(this)  
//	}
	 render() {
    	{Context.init()}
        return (
            <div className='allYmbot' >		  
			  	<div>
			  	<NavBar1 />
			  	<Content
			  	    dialogs={this.state.dialogs}
					fadetoHrDisplay={this.state.fadetoHrDisplay}
					waitDisplay={this.state.waitDisplay}
					toHrHeight = {this.state.toHrHeight}
					changeYmbotState={this.changeChatContent} 
					openMoreYmbotChat = {this.openMoreYmbotChat}
				/>
			  	
			  	<UserInput
			  		changeYmbotState={this.changeChatContent} 
			  	/>
			  	</div>
			  	<MyPopup 
			  		moreDisplay = {this.state.moreDisplay}
			  		showOrHidden = {this.state.moreDisplay}
			  		closeMoreYmbotChat = {this.closeMoreYmbotChat}
			  		question = {this.state.question}
			  		answer = {this.state.answer}
			  	/>
            </div>
        );
    }
}



module.exports = Ymbot;