const React = require('react');
const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const siteConfig = require(process.cwd() + '/siteConfig.js');

const NetworkLink = props => {
  if (props.text) {
    return (
      <div>
        <img
          style={{ marginRight: 4 }}
          height={props.size}
          width={props.size}
          src={props.iconSource}
          alt={props.iconAlt}
        />
        <a href={props.url} target="_blank" rel="noreferrer noopener">
          <span className="anchor_text">{props.text}</span>
        </a>
      </div>
    );
  } else return null;
};

const Member = ({ member, imageSize }) => {
  const { github, twitter, name, crowdin, role, active } = member;
  const avatarUrl = `https://avatars.githubusercontent.com/${github}`;
  const twitterUrl = `https://twitter.com/${twitter}`;
  const githubUrl = `https://github.com/${github}`;
  const crowdinUrl = `https://crowdin.com/profile/${crowdin}`;
  const size = imageSize || 100;

  // to disable an member it has to be strictly false
  if (!active && active === false) {
    return null;
  }

  return (
    <div className="member_media_object">
      <div>
        <h5>
          <div>
          {name}
          </div>
          <div className="team_role">
            {role ? `${role}` : ''}
          </div>
          </h5>
      </div>
      <div className="member_avatar">
        <img src={avatarUrl} height={size} width={size} alt="{{name}}" />
      </div>
      <div className="member_info">
        <NetworkLink
          iconAlt="github"
          iconSource={`/svg/social/github.svg`}
          size="16"
          url={githubUrl}
          text={github}
        />
        <NetworkLink
          iconAlt="twitter"
          iconSource="/svg/social//twitter.svg"
          size="16"
          url={twitterUrl}
          text={twitter}
        />
        <NetworkLink
          iconAlt="crowdin"
          iconSource="/svg/social/crowdin.ico"
          size="16"
          url={crowdinUrl}
          text={crowdin}
        />
      </div>
    </div>
  );
};

const MemberSection = props => {
  return (
    <div className="member_section">
      <h2 className="member_title">{props.title}</h2>
      <div className="member_group">
        {props.members.map(member => {
          return <Member
            key={member.github}
            member={member}
            imageSize={props.imageSize} />;
        })}
      </div>
    </div>
  );
};



const TranslatorMemberSections = props => {
  return (
    <div className="member_section">
      <h4 className="language_title">{props.title}</h4>
      <div>
        <div>
          <div className="member_group">
            {props.translator.map(member => {
              return <Member
                key={member.crowdin}
                member={member}
                imageSize={60} />;
            })}
        </div>
      </div>
      </div>
    </div>
  );
};

const LanguagesGroups = props => {
  const languages = Object.keys(props.languages);

  return (
    <div>
      <h3 className="member_type translator_type">{props.title}</h3>
      <div className="translator_group">
        {languages.map((function(language) {
          const lang = props.languages[language];

          return <TranslatorMemberSections
            key={language}
            title={language}
            translator={lang}/>;
        }))}
      </div>
    </div>
  );
};

const CrowdingTranslators = props => {
  return (
    <div className="translation_section">
      <h2>
        Crowding Translators
      </h2>
      <div>
        <LanguagesGroups languages={props.translators}/>
      </div>
    </div>
  );
};

const BannerTitle = () => {
  return (
    <h1 className="banner_members_title">
      Team Members
    </h1>
  );
};


class Team extends React.Component {
  render() {
    const {admons, maintainers, translators} = siteConfig.team;

    return (
      <div className="mainContainer">
        <Container padding={['bottom']}>
          <BannerTitle/>
          <div class="team_container">
            <MemberSection title="Core" members={admons} imageSize={100}/>
            <MemberSection title="Maintainers" members={maintainers} imageSize={80}/>
            <CrowdingTranslators translators={translators} />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Team;
