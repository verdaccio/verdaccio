/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
import type { FS as HasteFS } from 'jest-haste-map';
import { SnapshotResolver as JestSnapshotResolver } from './snapshot_resolver';
import SnapshotState from './State';
import type { Context } from './types';
import * as utils from './utils';
declare const JestSnapshot: {
    EXTENSION: string;
    SnapshotState: typeof SnapshotState;
    addSerializer: (plugin: import("pretty-format/build/types").Plugin) => void;
    buildSnapshotResolver: (config: Config.ProjectConfig) => JestSnapshotResolver;
    cleanup: (hasteFS: HasteFS, update: Config.SnapshotUpdateState, snapshotResolver: JestSnapshotResolver, testPathIgnorePatterns?: string[] | undefined) => {
        filesRemoved: number;
        filesRemovedList: Array<string>;
    };
    getSerializers: () => import("pretty-format/build/types").Plugins;
    isSnapshotPath: (path: string) => boolean;
    toMatchInlineSnapshot: (this: Context, received: any, propertiesOrSnapshot?: string | object | undefined, inlineSnapshot?: string | undefined) => {
        message: () => string;
        name: string;
        pass: boolean;
        actual?: undefined;
        expected?: undefined;
    } | {
        message: () => string;
        pass: boolean;
        name?: undefined;
        actual?: undefined;
        expected?: undefined;
    } | {
        actual: string;
        expected: string | undefined;
        message: () => string;
        name: string;
        pass: boolean;
    };
    toMatchSnapshot: (this: Context, received: any, propertiesOrHint?: string | object | undefined, hint?: string | undefined) => {
        message: () => string;
        name: string;
        pass: boolean;
        actual?: undefined;
        expected?: undefined;
    } | {
        message: () => string;
        pass: boolean;
        name?: undefined;
        actual?: undefined;
        expected?: undefined;
    } | {
        actual: string;
        expected: string | undefined;
        message: () => string;
        name: string;
        pass: boolean;
    };
    toThrowErrorMatchingInlineSnapshot: (this: Context, received: any, inlineSnapshot?: string | undefined, fromPromise?: boolean | undefined) => {
        message: () => string;
        name: string;
        pass: boolean;
        actual?: undefined;
        expected?: undefined;
    } | {
        message: () => string;
        pass: boolean;
        name?: undefined;
        actual?: undefined;
        expected?: undefined;
    } | {
        actual: string;
        expected: string | undefined;
        message: () => string;
        name: string;
        pass: boolean;
    };
    toThrowErrorMatchingSnapshot: (this: Context, received: any, hint: string | undefined, fromPromise: boolean) => {
        message: () => string;
        name: string;
        pass: boolean;
        actual?: undefined;
        expected?: undefined;
    } | {
        message: () => string;
        pass: boolean;
        name?: undefined;
        actual?: undefined;
        expected?: undefined;
    } | {
        actual: string;
        expected: string | undefined;
        message: () => string;
        name: string;
        pass: boolean;
    };
    utils: typeof utils;
};
declare namespace JestSnapshot {
    type SnapshotResolver = JestSnapshotResolver;
    type SnapshotStateType = SnapshotState;
}
export = JestSnapshot;
