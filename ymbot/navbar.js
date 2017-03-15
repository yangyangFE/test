/**
 * Created by  yangyang11 on 2017/1/13.
 */
import React,{Component} from 'react';
import { NavBar} from 'antd-mobile';
import Context from '../../../util/context';
import './navbar.less';
class NavBar1 extends Component{
    constructor(props){
        super(props);
    }
   
    render(){
        return (
        	<div className='navbar'>
               <NavBar leftContent="" mode="light" onLeftClick={Context.cback}>我要提问</NavBar>
            </div>
        );
    }
}
module.exports = NavBar1;