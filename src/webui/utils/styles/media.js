import { css } from 'emotion';

const breakpoints = {
  small: 576,
  medium: 768,
  large: 1024,
  xlarge: 1275,
};

const mq = Object.keys(breakpoints).reduce(
  (accumulator, label) => {
    const prefix =
      typeof breakpoints[label] === 'string'
        ? ''
        : 'min-width:';
    const suffix =
      typeof breakpoints[label] === 'string' ? '' : 'px';
    accumulator[label] = cls =>
      css`
        @media (${prefix + breakpoints[label] + suffix}) {
          ${cls};
        }
      `;
    return accumulator;
  },
  {}
);

export default mq;
