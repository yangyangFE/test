/**
 * Created by  yangyang11 on 2017/1/13.
 */
import React,{Component} from 'react';
import {Popup, NavBar} from 'antd-mobile';
import './YmbotInformation.less';
class YmbotInformation extends Component{
    constructor(props){
        super(props);
    }
    render(){
    	let h = window.innerHeight;
        return (
        	<div className="YmbotInformation" style={{height:h}}>
        		<div className="photoArea">
        			<NavBar leftContent="" mode="light" onLeftClick={() => Popup.hide()}
           				rightContent={''}
          				></NavBar>
        		    <div className="photoArea">
	        		   <div className="photo">
	        		      <img src={require('./../../../static/image/ymbot/bigBot.png')} alt={''} style={{display:'block',width:'100%'}}/>
	        		   </div>
	        		</div>
        		</div>
        		<div className="informationArea">
        			<div className='informationPanel'>
        				<div className="information">
        					<div className="option">姓名</div>
        					<div className="content">雪儿</div>
        				</div>
        				<div className="information">
        					<div className="option">别名</div>
        					<div className="content">HR小助手</div>
        				</div>
        				<div className="information">
        					<div className="option">性别</div>
        					<div className="content">女</div>
        				</div>
        				<div className="information">
        					<div className="option">国籍</div>
        					<div className="content">中国</div>
        				</div>
        				<div className="information">
        					<div className="option">籍贯</div>
        					<div className="content">友人才产品部</div>
        				</div>
        				<div className="information">
        					<div className="option">特长</div>
        					<div className="content">上知天文,下知地理</div>
        				</div>
        				<div className="information">
        					<div className="option">爱好</div>
        					<div className="content">为人民服务</div>
        				</div>
        			</div>
        			<div className="ymbotLabel">
    					<div className="option">标签</div>
    					<div className="content">
    						<div className="topArea">
    							<div className="labelButton">
    								<div className="content">宅女</div>
    								<div className="ltrigle" />
    							</div>
    							<div className="labelButton">
    								<div className="content">智慧女神</div>
    								<div className="ltrigle" />
    							</div>
    							<div className="labelButton">
    								<div className="content">温柔似水</div>
    								<div className="ltrigle" />
    							</div>
    						</div>
    						<div className="bottomArea">
    							<div className="labelButton">
    								<div className="content">耐心细致</div>
    								<div className="ltrigle" />
    							</div>
    							<div className="labelButton">
    								<div className="content">白骨精</div>
    								<div className="ltrigle" />
    							</div>
    							<div className="labelButton">
    								<div className="content">HR达人</div>
    								<div className="ltrigle" />
    							</div>
    						</div>
    					</div>
        			</div>
        		</div>
        	     
            </div>
        );
    }
}
module.exports = YmbotInformation;