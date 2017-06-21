import styled from 'styled-components';

const MenuItem = styled.li``;

const HeaderNav = styled.header`
    background: #cc3d33;
    margin: 0px;
`;

const Navigation = styled.nav`
  margin-bottom: 0px;
  border-radius: 0px;
  position: relative;
  min-height: 50px;
  font-size: 14px;
  border: none;
  color: white;
`;

const MenuGroup = styled.ul`	
  display: flex;
  margin: 0;
  align-items: center;
  padding: 0;
  list-style-type: none;
`;

const LogoItem = styled(MenuItem)`
  width: 100px;
  height: 50px;
  padding: 5px;
`;

const Code = styled.code`
  background: none;
  color: white;
`;

const LogoImage = styled.img`
    padding-top: 5px;
    width: 85%;
    height: 85%;
`;

const CodeGroup = styled.div`
    line-height: 1.5em;
`;

export { Code, LogoImage, CodeGroup, MenuGroup, Navigation, HeaderNav, MenuItem, LogoItem }
