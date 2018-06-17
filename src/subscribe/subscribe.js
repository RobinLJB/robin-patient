import React from 'react';
import {Article} from 'react-weui';
import qrcode from '../image/qrcode.jpg';

class Subscribe extends React.Component {
  render() {

    return(
      <Article style={
        {
          height : '100vh',
          backgroundColor : '#F7F7FA'
        }
      }>
            		<h1 className="has-text-dark is-size-5 text-center" >享点医交流平台</h1>
	            <section className="has-text-dark is-size-7">
	                    <p>
	                    		本平台是牙医与患友O2O交流平台;汇聚口腔医学界
	                    		知名医生.以服务牙医,关爱患友为宗旨.针对患友
	                    		的服务主要有:网上咨询 挂号 求诊等服务;针对医生
	                    		的服务有:口腔执业与助理医师考前培训 口腔主治医师
	                    		考前培训 口腔医学类技术培训 网上接诊等.
	                     </p>
	                     <section>
	                     	<p className="has-text-primary is-size-6 text-center">
	                     		关注公众号后根据提示点击直播链接进入直播
	                     	</p>
	                     </section>
	                     <figure className="image is-1by1 ">
		  					<img src={qrcode} />
          </figure>
	            </section>
        		</Article>
    );
  }
}

export default Subscribe;
