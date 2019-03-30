/**
 * @prettier
 * @flow
 */

/**
 * CSS to represent truncated text with an ellipsis.
 */
export function ellipsis(width: string | number) {
  return {
    display: 'inline-block',
    maxWidth: width,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
  };
}

/**
 * Shorthand that accepts up to four values, including null to skip a value, and maps them to their respective directions.
 */
interface SpacingShortHand<type> {
  top?: type;
  right?: type;
  bottom?: type;
  left?: type;
}

const positionMap = ['Top', 'Right', 'Bottom', 'Left'];

export function spacing(property: 'padding' | 'margin', ...values: Array<SpacingShortHand<number | string>>) {
  const [firstValue = 0, secondValue = 0, thirdValue = 0, fourthValue = 0] = values;
  const valuesWithDefaults = [firstValue, secondValue, thirdValue, fourthValue];
  let styles = {};
  for (let i = 0; i < valuesWithDefaults.length; i += 1) {
    if (valuesWithDefaults[i] || valuesWithDefaults[i] === 0) {
      styles = {
        ...styles,
        [`${property}${positionMap[i]}`]: valuesWithDefaults[i],
      };
    }
  }
  return styles;
}
