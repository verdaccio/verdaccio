import styled from 'react-emotion';
import CircularProgress from '@material-ui/core/CircularProgress';
import colors from '../../utils/styles/colors';

export const Wrapper = styled.div`
  && {
    ${({ centered }) => centered && `
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    `}
`;

export const Circular = styled(CircularProgress)`
  && {
    color: ${colors.primary}
`;
