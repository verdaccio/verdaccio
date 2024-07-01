import { createModel } from '@rematch/core';
import orderBy from 'lodash/orderBy';

import { SearchResultWeb } from '@verdaccio/types';

import type { RootModel } from '.';
import API from '../api';
import { APIRoute } from './routes';
import { stripTrailingSlash } from './utils';

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
      controllers.forEach((request) => {
        request?.abort();
      });
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
      const basePath = stripTrailingSlash(state.configuration.config.base);
      try {
        const controller = new window.AbortController();
        dispatch.search.addControllerToQueue({ controller });
        const signal = controller.signal;
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#Browser_compatibility
        // FUTURE: signal is not well supported for IE and Samsung Browser
        const suggestions: SearchResultWeb[] = await API.request(
          `${basePath}${APIRoute.SEARCH}${encodeURIComponent(value)}`,
          'GET',
          {
            signal,
            headers: {},
          }
        );
        const orderedSuggestions = orderBy(suggestions, ['verdaccioPrivate'], ['desc']);
        dispatch.search.saveSearch({
          suggestions: orderedSuggestions,
        });
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
