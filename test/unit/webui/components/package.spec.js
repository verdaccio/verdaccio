/**
 * Package component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Package from '../../../../src/webui/components/Package/index';
import Tag from '../../../../src/webui/components/Tag/index';
import { Version, Wrapper, Field, OverviewItem } from '../../../../src/webui/components/Package/styles';


/**
 * Generates one month back date from current time
 * @return {object} date object
 */
const dateOneMonthAgo = () => new Date(1544377770747)

describe('<Package /> component', () => {
  it('should load the component', () => {
    const props = {
      name: 'verdaccio',
      version: '1.0.0',
      time: dateOneMonthAgo(),
      license: 'MIT',
      description: 'Private NPM repository',
      author: {
        name: 'Sam'
      },
      keywords: [
        "verdaccio"
      ]
    };

    const wrapper = shallow(
      <Package {...props} />
    );

  
    // integration expectations

    // check link
    expect(wrapper.find(Wrapper).prop('to')).toEqual(`detail/${props.name}`);

    // check version
    expect(wrapper.find(Version).prop('children')).toEqual(`v${props.version}`);

    // TODO - REWRITE THE TEST
    //expect(wrapper.find(Author).dive())

    // check description
    expect(wrapper.find(Field).someWhere(n => {
      return (
        n.children().first().get(0).props.children[0].props.text === 'Description' && 
        n.children().childAt(1).containsMatchingElement(<span>{props.description}</span>)
      )
    })).toBe(true);

    // check license
    expect(wrapper.find(OverviewItem).someWhere(n => n.get(0).props.children[1] === props.license)).toBe(true);

    // check keyword
    expect(wrapper.find(Tag).prop('children')).toEqual(props.keywords[0]);

  });

  it('should load the component without author', () => {
    const props = {
      name: 'verdaccio',
      version: '1.0.0',
      time: dateOneMonthAgo(),
      license: 'MIT',
      author: {
        name: 'Anonymous',
        email: '',
        avatar: ''
      },
      description: 'Private NPM repository'
    };
    const wrapper = shallow(
      <Package {...props} />
    );

    // integration expectations
    expect(wrapper.html()).toMatchSnapshot();
  });
});
