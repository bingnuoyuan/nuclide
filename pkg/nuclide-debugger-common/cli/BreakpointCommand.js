/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {Command} from './Command';
import type {DebuggerInterface} from './DebuggerInterface';
import type {ConsoleIO} from './ConsoleIO';

export default class BreakpointCommand implements Command {
  name = 'breakpoint';

  // $TODO this will need more thorough help which will require extending the
  // help system to support subcommands
  helpText = 'Sets a breakpoint on the target.';

  _debugger: DebuggerInterface;
  _console: ConsoleIO;

  constructor(con: ConsoleIO, debug: DebuggerInterface) {
    this._console = con;
    this._debugger = debug;
  }

  async execute(args: string[]): Promise<void> {
    const breakpointSpec = args[0];
    if (breakpointSpec == null) {
      throw new Error("'breakpoint' requires a breakpoint specification.");
    }

    const sourceBreakPattern = /^(.+):(\d+)$/;
    const sourceMatch = breakpointSpec.match(sourceBreakPattern);
    if (sourceMatch != null) {
      const [, path, line] = sourceMatch;
      const result = await this._debugger.setSourceBreakpoint(
        path,
        parseInt(line, 10),
      );
      this._console.outputLine(`Breakpoint ${result.index} set.`);
      if (result.message != null) {
        this._console.outputLine(result.message);
      }
      return;
    }

    throw new Error("I can't figure out your breakpoint syntax.");
  }
}