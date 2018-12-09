/**
 * @prettier
 * @flow
 */

import styled, { css } from 'react-emotion';
import { Link } from 'react-router-dom';
import { default as Photo } from '@material-ui/core/Avatar';
import { default as Ico } from '../Icon';

import mq from '../../utils/styles/media';
import { ellipsis } from '../../utils/styles/mixings';

import Label from '../Label';

// HEADER
export const Header = styled.div`
  && {
    display: flex;
    flex-direction: column;
    padding: 0 0 5px 0;
  }
`;

export const Name = styled.span`
  && {
    ${ellipsis('50%')};
  }
`;

export const MainInfo = styled.span`
  && {
    font-size: 14px;
    font-weight: 600;
    line-height: 30px;
    flex: 1;
    color: #3a8bff;
    padding: 0 10px 0 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    :hover {
      ${Name} {
        text-decoration: underline;
      }
    }
  }
`;

export const OverviewItem = styled.span`
  && {
    display: flex;
    align-items: center;
    margin: 0 0 5px 0;
  }
`;

export const Overview = styled.span`
  && {
    position: relative;
    display: flex;
    flex-direction: column;
  }
`;

export const Version = styled.span`
  && {
    font-size: 12px;
    padding: 0 0 0 10px;
    margin: 0 0 0 5px;
    color: #9f9f9f;
    position: relative;
    ${ellipsis('100%')};
    :before {
      content: '•';
      position: absolute;
      left: 0;
    }
  }
`;

export const Icon = styled(Ico)`
  && {
    margin: 1px 5px 0 0;
    fill: #bfbfbf;
  }
`;

export const Published = styled.span`
  && {
    display: none;
    ${({ modifiers }) => modifiers};
  }
`;

// Content
export const Field = styled.div`
  && {
    padding: 0 0 10px 0;
  }
`;

export const Content = styled.div`
  && {
    ${Field} {
      :last-child {
        padding: 0;
      }
    }
  }
`;

export const Text = styled(Label)`
  && {
    color: #908ba1;
  }
`;

export const Details = styled.span`
  && {
    margin-left: 5px;
    line-height: 14px;
    display: flex;
    flex-direction: column;
  }
`;

export const Author = styled.div`
  && {
    display: flex;
    align-items: center;
  }
`;

export const Avatar = styled(Photo)`
  && {
    width: 30px;
    height: 30px;
    background: #4b5e40;
    font-size: 15px;
  }
`;

// Footer
export const Footer = styled.div`
  && {
    display: none;
    padding: 5px 0 0 0;
  }
`;

// Container
export const Wrapper = styled(Link)`
  && {
    font-size: 12px;
    background-color: #fff;
    margin: 0 0 15px 0;
    transition: box-shadow 0.15s;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    border-radius: 3px;
    padding: 10px;
    text-decoration: none;
    display: block;
    color: #2f273c;
    ${mq.medium(css`
      ${Header} {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      ${OverviewItem} {
        margin: 0 0 0 20px;
      }
      ${Overview} {
        flex-direction: row;
        ${OverviewItem} {
          :first-child {
            margin: 0;
          }
        }
      }
      ${Footer} {
        display: block;
      }
      ${Published} {
        display: inline-block;
      }
    `)};
  }
`;
