import { createModel } from '@rematch/core';
import { Package } from '@verdaccio/types';

import API from '../../providers/API/api';

import type { RootModel } from '.';

const CONSTANTS = {
  API_DELAY: 300,
  ABORT_ERROR: 'AbortError',
};

type SearchState = {
  suggestions: Partial<Package>[];
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
    saveSearch(state, { suggestions }: { suggestions: Partial<Package>[] }) {
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
        const suggestions: Partial<Package>[] = await API.request(
          `${basePath}-/verdaccio/search/${encodeURIComponent(value)}`,
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
