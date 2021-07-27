import React from 'react';

type SponsorImageProps = {
  url: string;
  image: string;
  name: string;
};
const SponsorImage = ({ url, image, name }: SponsorImageProps): React.ReactElement => (
  <a href={url} target="_blank" rel="noreferrer">
    <img src={image} alt={`${name} Logo`} loading="lazy" />
    <p>{name}</p>
  </a>
);

export default SponsorImage;
