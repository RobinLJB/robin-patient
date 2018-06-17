import React from 'react';
import {
  MediaBox,
  MediaBoxHeader,
  MediaBoxBody,
  MediaBoxTitle,
  MediaBoxDescription,
  Cell,
  CellBody,
  CellFooter,
  PanelBody
} from 'react-weui';
import {Link} from 'react-router-dom';
import fa from 'font-awesome/css/font-awesome.min.css';

//渲染是否在直播
function renderIsBroadcasting(type, isBroadcasting) {
  if (type == 0) {
    return null;
  } else {
    if (type == 1) {
      if (isBroadcasting == 1) {
        return (<span className="has-text-danger">直播中&nbsp;&nbsp;</span>);
      } else {
        return (<span className="has-text-primary">未直播&nbsp;&nbsp;</span>);
      }
    }
  }
}

function renderThumbUpOrStar(type) {
  if (type == 1) {
    return (<i className={fa.fa + ' ' + fa['fa-thumbs-up'] + ' ' + 'has-text-danger'}/>);
  } else {
    return (<i className={fa.fa + ' ' + fa['fa-star'] + ' ' + 'has-text-danger'}/>);
  }
}

function renderUserOrEye(type){
  if(type==1){
    return (<i className={fa.fa + ' ' + fa['fa-user-o'] + ' ' + 'has-text-primary'}/>);
  }else{
    return (<i className={fa.fa + ' ' + fa['fa-eye'] + ' ' + 'has-text-primary'}/>);
  }
}

export default class MenuItems extends React.Component {

onClick = function(e) {
  const url = this.props.url;
  console.log(`url:${url}`);
  React.history.push(this.props.url);
}.bind(this)

render() {

  const {
    id,
    icon,
    label,
    audience,
    thumbUp,
    type,
    isBroadcasting
  } = this.props;

  return (<Cell access={true} style={{
    paddingTop: '5px',
    paddingLeft: '15px',
    paddingBottom: '5px',
    paddingRight: '15px'
  }}>
    <CellBody>
      <Link to={id == '1'
        ? '/'
        : '/media/' + id}>
        <MediaBox type="appmsg" className="is-paddingless has-text-grey">
          <MediaBoxHeader>
            <img src={icon}></img>
          </MediaBoxHeader>
          <MediaBoxBody>
            <MediaBoxTitle className="has-text-left is-size-6">{label}</MediaBoxTitle>
            <MediaBoxDescription className="has-text-right ">
              {renderIsBroadcasting(type, isBroadcasting)}
              {renderUserOrEye(type)}
              <span>&nbsp;{audience}&nbsp;&nbsp;&nbsp;</span>
              {
                renderThumbUpOrStar(type)
              }
              <span>&nbsp;{thumbUp}&nbsp;&nbsp;&nbsp;</span>
            </MediaBoxDescription>
          </MediaBoxBody>
        </MediaBox>
      </Link>
    </CellBody>
    <CellFooter></CellFooter>
  </Cell>);
}
}
