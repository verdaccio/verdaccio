/**
 * @prettier
 * @flow
 */
import type { Styles } from '../../../../types';

export interface IProps {
  text: string;
  capitalize?: boolean;
  weight?: string;
  modifiers?: Styles;
}
