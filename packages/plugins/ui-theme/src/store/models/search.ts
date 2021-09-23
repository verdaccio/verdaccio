import { createModel } from '@rematch/core';

import API from '../../providers/API/api';

import type { RootModel } from '.';

const CONSTANTS = {
  API_DELAY: 300,
  ABORT_ERROR: 'AbortError',
};

export const search = createModel<RootModel>()({
  state: {
    // abort: () => void }
    suggestions: [],
    controller: [] as any[],
  },
  reducers: {
    clearRequestQueue(state) {
      const controllers = state.controller;
      controllers.forEach((request) => request.abort());
      return {
        state,
        controller: [],
      };
    },
    addControllerToQueue(state, { controller }) {
      const currentControllers = state.controller;
      return {
        ...state,
        controller: [...currentControllers, controller],
      };
    },
    setError(state) {
      return {
        ...state,
        isError: true,
      };
    },
    saveSearch(state, { suggestions }) {
      return {
        ...state,
        suggestions,
        isError: null,
      };
    },
  },
  effects: (dispatch) => ({
    async getSuggestions({ value }, state) {
      const basePath = state.configuration.config.base;
      try {
        const controller = new window.AbortController();
        // @ts-ignore
        dispatch.search.addControllerToQueue({ controller });
        const signal = controller.signal;
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#Browser_compatibility
        // FUTURE: signal is not well supported for IE and Samsung Browser
        const suggestions = await API.request(
          `${basePath}-/verdaccio/search/${encodeURIComponent(value)}`,
          'GET',
          {
            signal,
            headers: {},
          }
        );

        // @ts-ignore
        dispatch.search.saveSearch({ suggestions });
      } catch (error: any) {
        if (error.name === CONSTANTS.ABORT_ERROR) {
          // @ts-ignore
          dispatch.search.saveSearch({ suggestions: [] });
        } else {
          // @ts-ignore
          dispatch.search.setError();
        }
      }
    },
  }),
});
