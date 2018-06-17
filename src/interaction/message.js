import React from 'react';

export default class Message extends React.Component {

  render() {
    const {
      headPic,
      name,
      detail
    } = this.props;
    return(
      <div  style={{
        paddingLeft : '15px',
        paddingRight : '15px',
        marginBottom : '10px',
      }}>
        <article className="media">
			    <div className="box padding-xs  media-left">
			      <figure className="image is-32x32">
			        <img src={headPic} alt="Image" />
			      </figure>
			    </div>
			    <div className=" media-content">
			      <div className="content">
			        <div>
			          {name}
			          <br />
			          	<p className="box padding-sm" style={{
			          		marginTop :'5px',
			          		fontSize: '0.85rem',
			          	}}>
                  <strong>{detail}</strong>
                </p>
              </div>
			      </div>
			    </div>
			  </article>
      </div>
    );
  }
}
