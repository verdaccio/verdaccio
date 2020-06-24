import bannerLogo from './verdaccio-banner.svg';

const Background = ({children}) => {
	return (
		<div css={{
			background: `url(${bannerLogo})`,
			backgroundRepeat: 'repeat',
			minHeight: '45rem',
			backgroundSize: 'cover',
		}}>
			{children}
		</div>
	)
};

export { Background };
