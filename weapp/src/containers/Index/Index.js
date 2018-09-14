import React, { Component } from 'react';
import { Carousel } from 'antd';
import styles from './index.css'
class Index extends Component {
    constructor(props) {
        super(props)
  
    }
    state={
        isShowHead:false,
        startTop:0,
        status:false,
        contentTop:0,
        listTop:0,
        refreshing: false,
        down: true,
        height: document.documentElement.clientHeight,
    }
  

    componentDidMount(){
      
       
        
       
    }
   
    render() {
      
        return (
           <div>
                <Carousel autoplay>
                    <div><h3>1</h3></div>
                
                </Carousel>
                <div className='a'>

                </div>
           </div>   
        )
    }
}

export default Index