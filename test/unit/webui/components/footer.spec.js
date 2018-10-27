
import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import Footer from '../../../../src/webui/components/Footer/index';

describe('<Footer /> component', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <IntlProvider locale='en'>
                <Footer />
            </IntlProvider>,
        );
    });

    it('should set html from props poweredBy', () => {
        expect(
          wrapper
            .find('#poweredBy')
            .text()
        ).toEqual('Powered by');
        expect(wrapper.html()).toMatchSnapshot();
      });

    it('should set html from props withLove', () => {
        expect(
          wrapper
            .find('#withLove')
            .text()
        ).toEqual('Made with ❤ on');
        expect(wrapper.html()).toMatchSnapshot();
      });

    it('should load the inital state of Footer component', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should hover the earth in footer', () => {
        const earth = wrapper.find('img[alt="Earth"]');
        earth.simulate('click');
        setTimeout(function() {
            expect(wrapper.state('showAuthorsGeographic')).toEqual(true);
        }, 100);
    });
});
