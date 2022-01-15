import { createModel } from '@rematch/core';

import { SearchResultWeb } from '@verdaccio/types';

import type { RootModel } from '.';
import API from '../../providers/API/api';

const CONSTANTS = {
  API_DELAY: 300,
  ABORT_ERROR: 'AbortError',
};

type SearchState = {
  suggestions: SearchResultWeb[];
  controller: AbortController[];
};

export const search = createModel<RootModel>()({
  state: {
    suggestions: [],
    controller: [],
  } as SearchState,
  reducers: {
    clearRequestQueue(state) {
      const controllers = state.controller;
      controllers.forEach((request) => request.abort());
      return {
        ...state,
        controller: [],
      };
    },
    addControllerToQueue(state, { controller }: { controller: AbortController }) {
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
    saveSearch(state, { suggestions }: { suggestions: SearchResultWeb[] }) {
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
        dispatch.search.addControllerToQueue({ controller });
        const signal = controller.signal;
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#Browser_compatibility
        // FUTURE: signal is not well supported for IE and Samsung Browser
        const suggestions: SearchResultWeb[] = await API.request(
          `${basePath}-/verdaccio/data/search/${encodeURIComponent(value)}`,
          'GET',
          {
            signal,
            headers: {},
          }
        );

        dispatch.search.saveSearch({ suggestions });
      } catch (error: any) {
        if (error.name === CONSTANTS.ABORT_ERROR) {
          dispatch.search.saveSearch({ suggestions: [] });
        } else {
          dispatch.search.setError();
        }
      }
    },
  }),
});
