/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import expect from 'expect.js';
import { SuperTest } from 'supertest';
import { getUrlPrefix } from '../lib/space_test_utils';
import { DescribeFn, TestDefinitionAuthentication } from '../lib/types';

interface GetAllTest {
  statusCode: number;
  response: (resp: any) => void;
}

interface GetAllTests {
  exists: GetAllTest;
}

interface GetAllTestDefinition {
  auth?: TestDefinitionAuthentication;
  spaceId: string;
  tests: GetAllTests;
}

export function getAllTestSuiteFactory(esArchiver: any, supertest: SuperTest<any>) {
  const makeGetAllTest = (describeFn: DescribeFn) => (
    description: string,
    { auth = {}, spaceId, tests }: GetAllTestDefinition
  ) => {
    describeFn(description, () => {
      before(() => esArchiver.load('saved_objects/spaces'));
      after(() => esArchiver.unload('saved_objects/spaces'));

      it(`should return ${tests.exists.statusCode}`, async () => {
        return supertest
          .get(`${getUrlPrefix(spaceId)}/api/spaces/space`)
          .auth(auth.username, auth.password)
          .expect(tests.exists.statusCode)
          .then(tests.exists.response);
      });
    });
  };

  const getAllTest = makeGetAllTest(describe);
  // @ts-ignore
  getAllTest.only = makeGetAllTest(describe.only);

  const createExpectResults = (...spaceIds: string[]) => (resp: any) => {
    const expectedBody = [
      {
        id: 'default',
        name: 'Default Space',
        description: 'This is the default space',
        _reserved: true,
      },
      {
        id: 'space_1',
        name: 'Space 1',
        description: 'This is the first test space',
      },
      {
        id: 'space_2',
        name: 'Space 2',
        description: 'This is the second test space',
      },
    ].filter(entry => spaceIds.includes(entry.id));
    expect(resp.body).to.eql(expectedBody);
  };

  const expectEmptyResult = (resp: any) => {
    expect(resp.body).to.eql('');
  };

  const createExpectLegacyForbidden = (username: string) => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: `action [indices:data/read/search] is unauthorized for user [${username}]: [security_exception] action [indices:data/read/search] is unauthorized for user [${username}]`,
    });
  };

  return {
    getAllTest,
    createExpectResults,
    createExpectLegacyForbidden,
    expectEmptyResult,
  };
}
