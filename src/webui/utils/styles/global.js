import { injectGlobal } from 'emotion';
import { fontFamilyBase } from './fonts';
import { fontSize, fontWeight } from './sizes';
import { textColor } from './colors';

export default injectGlobal`
    html,
    body {
        height: 100%;
    }

    body {
        font-family: ${fontFamilyBase};
        font-size: ${fontSize.base};
        color: ${textColor};
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    strong {
        font-weight: ${fontWeight.semiBold};
    }
`;
