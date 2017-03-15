/**
 * Created by  yangyang11 on 2017/1/13.
 */
import React,{Component} from 'react';
import Context from '../../../util/context';
import {Popup, NavBar, Toast} from 'antd-mobile';
import Myquestion from '../feedback/feedbackForm';
import UserInput from './userInput';
import YmbotInformation from './ymbotInformation';
import AJAX from '../../../util/ajax';
import OpenIframePopup from './openIframePopup';
import './ymbot.css';
var inputQuestion = [];
var initBodyHeight;
var storageChat=[];
var chatDivHeight;
var summer = window.summer || window.s;
class Content extends Component{
    constructor(props){
        super(props);
		this.state = {
			url1:'',
			popupDisplay:'none',
			navDisplay1:'',
			chatDivHeight:'auto',
			zhankaiDisplay:'',
			welcomeDivMargin:"",
		}
		this.setUniqueID= this.setUniqueID.bind(this);
		this.OpenfeedbackDivToHrPopup= this.OpenfeedbackDivToHrPopup.bind(this);
		this.openMoreYmbotChat= this.openMoreYmbotChat.bind(this);
		this.openPopup= this.openPopup.bind(this);
		this.getUserImg= this.getUserImg.bind(this);
		this.setFeedbackDiv= this.setFeedbackDiv.bind(this);
		this.openYmbotInformation= this.openYmbotInformation.bind(this)
		this.sendNimbleAsking= this.sendNimbleAsking.bind(this);
		this.OpenAppOrUrl= this.OpenAppOrUrl.bind(this);
		this.switchAjaxCode= this.switchAjaxCode.bind(this);
		}
    
    /**
     * 为循环的节点设置 unique key
     * @return {Number}  随机数
     */
    setUniqueID() {
	    function s4(){
	        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	    }
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	            s4() + '-' + s4() + s4() + s4();
	}
    
	//打开hr反馈页面
	OpenfeedbackDivToHrPopup() {
		Popup.show(
			<Myquestion  />   		
		);
   }
	
   	/**
   	 * 打开机器人信息弹出层   机器人资料是写死的
   	 * @version 1.0 
   	 */
	openYmbotInformation(){
		Popup.show(
			<YmbotInformation />   		
		);
	}
	
	/**
	 * 点击展开详情的弹出层
	 * @param  {String} question 用户的问题
	 * @param  {String} allAnswer 机器人返回的text里的所有内容
	 */
	openMoreYmbotChat(question,allAnswer){
		this.props.openMoreYmbotChat(question,allAnswer)
	}
	
	/**
	 * 点击新闻链接,打开弹出层，把url传给弹出层里的iframe
	 * @param {String} listUrl 机器人抓取的外网链接
	 */
	
	// TODO 机器人如果抓取到检测并修正了top.location.href的外网，就会被强制改变域名，导致无法回到app，此问题一定要处理
	openPopup(listUrl){
//		summer.openWin({
//          id :'prove',
//          url :'html/prove/prove-module.html',
//          pageParam :{
//				count : 5
//			}        });
		Popup.show(
			 <OpenIframePopup url={listUrl} />
		)
	}
	
	
	//获取用户头像
	getUserImg(){
		let userContext=Context.getUserinfo();
		let userImg = userContext.u_useravator;
		let username = userContext.u_username;
		let user_code =JSON.parse(localStorage.getItem('userinfo')).u_usercode;
		
		username = username.substr(username.length-2, 2);
        let photo = '';
	  	if(userImg&&userImg!=="null"&&userImg!=="undefined") {
	  		photo = (<img src={userImg} alt={''} className="noPhoto"/>);
	  	} 
	  	else {
	  		photo = (<span className="ephoto" style={{backgroundColor:Context.getColor(user_code)}}>{username}</span>);
	  	}
	  	return photo;
	}
	
	
	//向hr反馈提示语及其显示与隐藏
	setFeedbackDiv(){
		let feedbackDivToHr =[];
		if(this.props.dialogs.length>0){ 
		feedbackDivToHr.push(
			<div className='ahcor' >
				<div style={{display:this.props.fadetoHrDisplay,width:'100%',marginTop:'0.2rem',height:'auto'}} >
					<div className='fadeTohr'> 
	              		<span className='toHrLeft'>没有想要的，</span>
						<span className='toHrRight' onClick={() => this.OpenfeedbackDivToHrPopup()}>找hr反馈</span>
	        		</div>
		  		</div>
			</div>
		);
      }
		return feedbackDivToHr;
	}
	
	
	/**
	 * 返回的text,按标签进行正则匹配,对应三种处理方式:快捷输入,打开app其他页面,打开链接
	 * @param {String} type 标签类型
	 * @param {String} text 内容
	 */
	OpenAppOrUrl(type,text){
		if(type=="input"){
			this.sendNimbleAsking(text);
		}else if(type=="app"){
			 text = text.split("//");
			 location.hash = text[1];
		}else if(type=="url"){
			//console.log(text);
			this.openPopup(text);
		}
	}

		
	/**
	 * 知识库匹配到的答案进行再次提问
	 * @param  {String} question 快捷提问
	 */
	sendNimbleAsking(question){
	     inputQuestion.push(question);
	    let lastQu = inputQuestion.length-2;
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
       
	}
	 
	 
	 //输入内容,实时滚动
	  componentDidUpdate(){
    	let toHrDom =document.getElementById('scrollDiv');
    	toHrDom.scrollIntoView();
      }
	  
	  
	  //初次进入,滚动到欢迎语
	  componentDidMount(){
	  	let helloDom  =document.getElementById('hello');
    	helloDom.scrollIntoView();
	  }
	  
	  switchAjaxCode(message,flag){
	  	let chatItem = [];
		  for (let i =message.length-1;i>=0;i--){			
			switch(message[i].code){				
				case 100:{
				  chatItem.push(
					<div key={i}>
				      <div className="userChat">
					  	<div className="userPhoto">
							{this.getUserImg()}
						</div>
						<div className="rtriangle" />
						<div className="userQuestion">
				            {message[i].question}
						</div>
					  </div>
			        </div>
 				  );
				}
				break;
				case 123:{
				  if (flag == "chatting"){
					  chatItem.push(
						<div key={i} style={{display:this.props.waitDisplay[i]}}>
					      <div className="ymbotAnswerDiv">
						    <div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
						    	<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
							</div>
							<div className="ltriangle" />
							<div className="ymbotAnswer">
							  {message[i].question}
							</div>
					      </div>
				        </div>
					  );
				  }
				}
				break;
				case 110000:{
	      			let listItem=[];
		  			for (let j=0;j<message[i].answers.length;j++){
			 		 listItem.push(
						<div key={j}>
		          			<div className="listItem" onClick={() => this.sendNimbleAsking(message[i].answers[j].question)}>
		  			      	<span>{j+1}.</span>	{message[i].answers[j].question}
				 		 	</div>
						</div>);
			  		
		  			}
		  		
		 		 	//chatItem.pop();
		 		 	chatItem.push(
						<div key={i}>				     		 
		     				<div className="ymbotAnswerDiv">
			    				<div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
			    					<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
								</div>
								<div className="ltriangle"></div>
								<div className="listTextDiv">
					  				<div className="listText">

					  				</div>
				  					{listItem}
								</div>
		     				</div>
		                </div>
		  			);	
				}
				break;

				case 110001:{
	      			let listItem=[];
		  			for (let j=0;j<message[i].answers.length;j++){
			 		 listItem.push(
						<div key={i}>
		          			<div className="listItem" onClick={() => this.openPopup(message[i].answers[j].url)}>
		  			      	<span></span>	{message[i].answers[j].text}
				 		 	</div>
						</div>);
			  
		  			}
		 		 	//chatItem.pop();
		 		 	chatItem.push(
						<div key={i}>				     		 
		     				<div className="ymbotAnswerDiv">
			    				<div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
			    					<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
								</div>
								<div className="ltriangle"></div>
								<div className="listTextDiv">
					  				<div className="listText">
										{message[i].answers[0].question}
					  				</div>
					  				<div className="listText">
										{message[i].answers[0].text}
					  				</div>
		          			<div className="listItem" onClick={() => this.openPopup(message[i].answers[j].url)}>
		  			      	<span></span>	查看详情
				 		 	</div>
								</div>
		     				</div>
		                </div>
		  			);	
				}
				break;

				case 100000:{
				
						  //chatItem.pop();
						  let richText = message[i].text;
						  let zhankai ="";
						  if(richText.length>150){
						  		zhankai=<div className="openPopup" onClick={()=> this.openMoreYmbotChat(message[i].question,message[i].text)}>
						  	            <div className="open">
						  	            	<div className="openText">展开详情</div>
						  	            	<div className="openIcon">
						  	            		<img src={require('./../../../static/image/ymbot/openMore.png')} alt={''} style={{display:'block',width:'100%'}}/>
						  	            	</div>
						  	            </div>
						  			</div>;
						  }
						  let str =message[i].text;
						  let urlPattern = new RegExp("(\\[([^\\]]+)\\]\\((http://[^\\)]+)\\))","g");
						  let appPattern = new RegExp("(\\[([^\\]]+)\\]\\((app://([^\\)]+))\\))","g");
						  let inputPattern = new RegExp("(\\[([^\\]]+)\\]\\(input\\))","g");
						  let flag; 
						  if(urlPattern.test(str)||appPattern.test(str)||inputPattern.test(str)){
						  	flag=1;
						  }else{
						  	flag=0;
						  }
						  str=str.replace(urlPattern,"<span style='color:#1baede;margin-top:0.1rem' t='url' l='$3'>$2<span>");
						  str=str.replace(appPattern,"<span style='color:#1baede;margin-top:0.1rem' t='app' l ='$3'>$2</span>")
						  str=str.replace(inputPattern,"<div style='color:#1baede;margin-top:0.1rem' t='input' l='$2'>$2</div>")
							var Ttt = React.createClass({ 
								test:function (e){
									this.props.OpenAppOrUrl(e.target.getAttribute("t"),e.target.getAttribute("l"))
								},
								render: function () { 
									return (<div onClick={this.test} dangerouslySetInnerHTML={{__html: str}} />)
								}
							});
						  richText= richText.substring(0,157);
						  let insertChatDiv ="";
						  if(flag==1){
						  	insertChatDiv =  <Ttt OpenAppOrUrl = {this.OpenAppOrUrl} />;
						  }else{
						  	insertChatDiv = <div dangerouslySetInnerHTML={{__html: richText}} />;
						  }
						  chatItem.push(
							<div key={i}>
						      <div className="ymbotAnswerDiv">
							    <div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
							    	<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
								</div>
								<div className="ltriangle" />
								<div className="ymbotAnswer">
								 {insertChatDiv}
								   <div>
								   	    {zhankai}
								   </div>
								</div>
						      </div>
					        </div>
						  );
				  
				}
				break;
				case 200000:{
						  //chatItem.pop();
						  chatItem.push(
							<div key={i}>
								<div className="ymbotAnswerDiv">
								    <div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
								    	<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
									</div>
									<div className="ltriangle" />
									<div className="listTextDiv">
						  				<div className="listText" onClick={() => this.openPopup(message[i].url)}>
							 				<span style={{color:'#1baede'}}>{message[i].text}</span>
						  				</div>
									</div>
						     	</div>
		                    </div>
						  );	
						}
				break;
				//返回的链接太多的话,只展示前五个
				case 302000:{
	      			let listItem=[];
	      			
	      			if (message[i].list.length > 5){
	      				message[i].list = message[i].list.slice(0,5)
	      			}
		  			for (let j=0;j< message[i].list.length; j++){
		  		     	if(message[i].list[j].article){
			 				 listItem.push(
								<div key={this.setUniqueID()}>
				          			<div className="listItem" onClick={() => this.openPopup(message[i].list[j].detailurl)}>
				  			      	<span>{j+1}.</span>	{message[i].list[j].article}
						 		 	</div>
								</div>);
					    }
			  
		  			}
		 		 	//chatItem.pop();
		 		 	chatItem.push(
						<div key={this.setUniqueID()}>				     		 
		     				<div className="ymbotAnswerDiv">
			    				<div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
			    					<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
								</div>
								<div className="ltriangle"></div>
								<div className="listTextDiv">
					  				<div className="listText">
						 				{message[i].text}
					  				</div>
				  					{listItem}
								</div>
		     				</div>
		                </div>
		  			);	
				}
				break;
				case 308000:{
	      			let listItem=[];
		  			for (let j=0;j<message[i].list.length;j++){
			 		 listItem.push(
						<div key={this.setUniqueID()}>
		          			<div className="listItem" onClick={() => this.openPopup(message[i].list[j].detailurl)}>
		  			      	<span>{j+1}.</span>	{message[i].list[j].info}
				 		 	</div>
						</div>);					  
		  			}
		 		 	//chatItem.pop();
		 		 	chatItem.push(
						<div key={this.setUniqueID()}>				     		 
		     				<div className="ymbotAnswerDiv">
			    				<div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
			    					<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
								</div>
								<div className="ltriangle" />
								<div className="listTextDiv">
					  				<div className="listText">
						 				{message[i].text}
					  				</div>
					  				{listItem}
								</div>
		      				</div>
            			</div>
		  			);	
				}
				break;

//				case 309000:{
//	      			let listItem=[];
//		  			for (let j=0;j<message[i].list.length;j++){
//			 		 listItem.push(
//						<div key={i}>
//		          			<div className="listItem" onClick={() => this.sendNimbleAsking(message[i].list[j].info)}>
//		  			      	<span>{j+1}.</span>	{message[i].list[j].info}
//				 		 	</div>
//						</div>);					  
//		  			}
//		 		 	chatItem.push(
//						<div key={i}>				     		 
//		     				<div className="ymbotAnswerDiv">
//			    				<div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
//			    					<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
//								</div>
//								<div className="ltriangle" />
//								<div className="listTextDiv">
//					  				<div className="listText">
//						 				{message[i].text}
//					  				</div>
//					  				{listItem}
//								</div>
//		      				</div>
//          			</div>
//		  			);	
//				}
//				break;
				break;
	   			default:{
		 			//chatItem.pop();
		 			chatItem.push(
						<div key={i}>
		      				<div className="ymbotAnswerDiv">
			    				<div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
			    					<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
								</div>
								<div className="ltriangle" />
								<div className="listTextDiv">
					  				<div className="listText">
						 				{this.props.dialogs[i].text}
					  				</div>
								</div>
		     				</div>
	        			</div>
		 			);				  
				}			   			
			}		
		}
		  return chatItem;
	  }
	  
	 //获取历史消息,并把将要渲染的消息存放到storageChat数组里
	 // TODO 此代码后期需优化
	 componentWillMount(){
	 	//获取u_usercode和u_staffid
	 	let userContext=Context.getUserinfo();
		let userCode = userContext.u_usercode;
		let staffid1 = userContext.u_staffid;
		
	 	let storageChatMessage=JSON.parse(localStorage.getItem(userCode)); //加入用户id,作为标识符
	 	if(storageChatMessage){
	 		if(staffid1==storageChatMessage.staffid){
	 			storageChat = this.switchAjaxCode(storageChatMessage.chat,"history");
	 			this.setState({
	 				welcomeDivMargin:'0rem',
	 			})
	   storageChat.push(
			<div style={{height:'0.4rem'}} />
		);
		//console.log(storageChatMessage);
	 	}else{
	 		this.setState({
	 				welcomeDivMargin:'0.5rem',
	 			})
	 	}
	  }else{
	  	this.setState({
	 				welcomeDivMargin:'0.5rem',
	 			})
	  }
	}
    render() {
		let chatItem = this.switchAjaxCode(this.props.dialogs,"chatting");
		  let h = document.body.clientHeight; 
		  h = h-44-94;   //ymbotDiv是聊天内容滚动容器  44和94分别是导航栏高度和输入框高度
		  				//后期如果这里出了问题,应该body 和 html 100%被修改
	return (
            <div className="ymbotDiv" style={{height:h}}>
				  {storageChat}
				  <div className="initYmbotDiv" id='hello' style={{marginTop:this.state.welcomeDivMargin}}>
					<div className="ymbotPhoto" onClick={() => this.openYmbotInformation()}>
						<img src={require('./../../../static/image/ymbot/bot.png')} alt={''} style={{display:'block',width:'100%'}}/>
					</div>
					<div className="ltriangle"></div>
					<div className="listTextDiv">
		  				<div className="listText">
			 				您好，我是HR小助手雪儿，<br/>
							有什么疑难问题都可以问我。

		  				</div>
					</div>
				   </div>
				   {chatItem}
				   {this.setFeedbackDiv()}
				   <div style={{height:'0.5rem',display:this.props.toHrDisplay}} ref='scrollDiv' id ='scrollDiv'/>
			</div>
        );
    
    }
      

}
module.exports = Content;