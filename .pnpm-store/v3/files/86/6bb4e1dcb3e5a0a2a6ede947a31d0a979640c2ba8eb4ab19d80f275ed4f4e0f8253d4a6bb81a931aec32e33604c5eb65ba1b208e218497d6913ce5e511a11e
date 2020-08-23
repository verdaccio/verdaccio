/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type { Context, Script } from 'vm';
import type { Config, Global } from '@jest/types';
import { ModuleMocker } from 'jest-mock';
import { LegacyFakeTimers, ModernFakeTimers } from '@jest/fake-timers';
import type { EnvironmentContext, JestEnvironment } from '@jest/environment';
import { JSDOM } from 'jsdom';
declare type Win = Window & Global.Global & {
    Error: {
        stackTraceLimit: number;
    };
};
declare class JSDOMEnvironment implements JestEnvironment {
    dom: JSDOM | null;
    fakeTimers: LegacyFakeTimers<number> | null;
    fakeTimersModern: ModernFakeTimers | null;
    global: Win;
    errorEventListener: ((event: Event & {
        error: Error;
    }) => void) | null;
    moduleMocker: ModuleMocker | null;
    constructor(config: Config.ProjectConfig, options?: EnvironmentContext);
    setup(): Promise<void>;
    teardown(): Promise<void>;
    runScript<T = unknown>(script: Script): T | null;
    getVmContext(): Context | null;
}
export = JSDOMEnvironment;
