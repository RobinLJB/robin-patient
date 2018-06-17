import React from 'react';
import { Article } from 'react-weui';

class Subject extends React.Component{

  render(){

    const {title,subject} = this.props;

    return(
      <Article>
	            <p className="hero is-size-6 has-text-centered has-text-primary">
          {title}
        </p>
        <p className="hero is-size-7 has-text-left has-text-primary" dangerouslySetInnerHTML={{__html:subject}}>
        </p>
      </Article>
    );
  }
}

export default Subject;
