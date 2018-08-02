/**
 * Maintainers component
 */

import React from 'react';
import { mount } from 'enzyme';
import Maintainers from '../../../../../src/webui/components/PackageSidebar/modules/Maintainers/index';
import { packageMeta } from '../store/packageMeta';

describe('<PackageSidebar /> : <Maintainers />', () => {
  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = mount(<Maintainers packageMeta={packageMeta} />);
    instance = wrapper.instance();
  });

  it('should match with the props', () => {
    expect(wrapper.props().packageMeta).toEqual(packageMeta);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('author shoule be equal to User NPM', () => {
    expect(instance.author).toEqual({
      avatar:
        'https://www.gravatar.com/avatar/a5a236ba477ee98908600c40cda74f4a',
      email: 'test@author.local',
      name: 'User NPM'
    });
  });

  it('should get all the contributors with false for showAllContributors', () => {
    expect(instance.showAllContributors).toBeFalsy();
  });

  it('should get unique contributors', () => {
    const result = [
      {
        avatar:
          'https://www.gravatar.com/avatar/4ef03c2bf8d8689527903212d96fb45b',
        email: 'test1@test.local',
        name: '030'
      },
      {
        avatar:
          'https://www.gravatar.com/avatar/06975001f7f2be7052bcf978700c6112',
        email: 'tes4@test.local',
        name: 'Alex Vernacchia'
      },
      {
        avatar:
          'https://www.gravatar.com/avatar/d9acfc4ed4e49a436738ff26a722dce4',
        email: 'test5@test.local',
        name: 'Alexander Makarenko'
      },
      {
        avatar:
          'https://www.gravatar.com/avatar/2e095c7cfd278f72825d0fed6e12e3b1',
        email: 'test6@test.local',
        name: 'Alexandre-io'
      },
      {
        avatar:
          'https://www.gravatar.com/avatar/371edff6d79c39bb9e36bde39d41a4b0',
        email: 'test7@test.local',
        name: 'Aram Drevekenin'
      }
    ];
    expect(instance.uniqueContributors).toEqual(result);
  });

  it('should click on handleShowAllContributors', () => {
    wrapper.find('button').simulate('click');
    expect(wrapper.state('showAllContributors')).toBeTruthy();
  });
});
