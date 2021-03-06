/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { DatabaseAdapter } from './adapters/database/adapter_types';
import { FrameworkUser } from './adapters/framework/adapter_types';

import { CMBeatsDomain } from './beats';
import { BackendFrameworkLib } from './framework';
import { CMTagsDomain } from './tags';
import { CMTokensDomain } from './tokens';

export type UserOrToken = FrameworkUser | string;

export interface CMServerLibs {
  framework: BackendFrameworkLib;
  database?: DatabaseAdapter;
  beats: CMBeatsDomain;
  tags: CMTagsDomain;
  tokens: CMTokensDomain;
}

export enum BeatEnrollmentStatus {
  Success = 'Success',
  ExpiredEnrollmentToken = 'Expired enrollment token',
  InvalidEnrollmentToken = 'Invalid enrollment token',
}
