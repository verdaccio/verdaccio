const React = require("react");
const ReactDOM = require("react-dom");
const CompLibrary = require("docusaurus/lib/core/CompLibrary.js");
const Container = CompLibrary.Container;
const translate = require("docusaurus/lib/server/translate.js").translate;

const BannerTitle = (props) => {
  return <h1 className="header_title">{props.title}</h1>;
};

class Contributors extends React.Component {
  componentDidMount() {
    const obj = ReactDOM.findDOMNode(this);
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
    console.lo
  }

  render() {
    return (
      <div className="mainContainer">
        <header className="postHeader">
          <Container>
            <h2>
              <translate>
                Contributors
              </translate>
            </h2>
            <iframe
              src="https://verdacciocontributors.gtsb.io/"
              id="iframeC"
              frameBorder="0"
              scrolling="yes"
              width="100%"
              style={{height: '100vh'}}
            />
          </Container>
        </header>
      </div>
    );
  }
}

module.exports = Contributors;
