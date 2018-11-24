/**
 * @prettier
 * @flow
 */

import styled, { css } from 'react-emotion';
import { IProps } from './types';

const getSize = (size: string) => {
  switch (size) {
    case 'md':
      return `
        width: 20px;
        height: 18px;
      `;
    default:
      return `
        width: 18px;
        height: 18px;
      `;
  }
};

const commonStyle = ({ size = 'sm', pointer }: IProps) => css`
  && {
    padding: 0 5px;
    display: inline-block;
    cursor: ${pointer ? 'pointer' : 'default'};
    ${getSize(size)};
  }
`;

export const SVG = styled.svg`
  && {
    ${commonStyle};
  }
`;

export const ImgWrapper = styled.span`
  && {
    ${commonStyle};
  }
`;

export const Img = styled.img`
  && {
    width: 100%;
    height: auto;
  }
`;
