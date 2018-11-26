
import React from 'react';
import { mount } from 'enzyme';

import Footer from '../../../../src/webui/components/Footer/index';

jest.mock('../../../../package.json', () => ({
    version: '4.0.0-alpha.3'
}))

describe('<Footer /> component', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<Footer />);
    });

    it('should load the initial state of Footer component', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });
});
