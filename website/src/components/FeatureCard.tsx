import React from 'react';
import styles from './FeatureCard.module.scss';

type FeatureCardProps = {
  title: string;
  subtitle: string;
  image: string;
};
const FeatureCard = ({ title, subtitle, image }: FeatureCardProps): React.ReactElement => (
  <div className={styles.featureCard}>
    <img loading="lazy" src={image} alt="Feature Logo" />
    <div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  </div>
);

export default FeatureCard;
