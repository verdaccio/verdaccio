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
import colors from '../../utils/styles/colors';

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
    color: ${colors.primary};
  }
`;

export const MainInfo = styled.span`
  && {
    font-size: 16px;
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
    margin: 0 0 0 16px;
    color: #908ba1;
    font-size: 16px;
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
    margin: 0px 10px 0px 0;
    fill: #908ba1;
  }
`;

export const Published = styled.span`
  && {
    color: #908ba1;
    ${({ modifiers }) => modifiers};
  }
`;

// Content
export const Field = styled.div`
  && {
    padding: 0 0 5px 0;
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

export const Description = styled.div`
  && {
    margin: 5px 0;
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
export const WrapperLink = styled(Link)`
  && {
    font-size: 12px;
    background-color: white;
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
        margin: 0 0 0 0;
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

/**
 * Ayush's style
 */

export const PackageName = styled.span`
  && {
    font-weight: 600;
    font-size: 20px;
    display: block;
    margin-bottom: 12px;
    color: #414141;
    cursor: pointer;

    &:hover {
      color: black;
    }
  }
`;
