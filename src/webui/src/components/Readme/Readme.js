import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ReadmeStyle = styled.div`
  margin-top: 10px;
  background: #ffffff;
  padding: 10px 12px;
  border-radius: 3px;
  border: 1px solid #dadada;
  color: #333;
  overflow: hidden;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  word-wrap: break-word;
`;

const Readme = (props) => {
  return (<ReadmeStyle className="readme"
                       dangerouslySetInnerHTML={{__html: props.html}}>
    </ReadmeStyle>
    );
};

Readme.propTypes = {
  html: PropTypes.string.isRequired,
};

export default Readme;
