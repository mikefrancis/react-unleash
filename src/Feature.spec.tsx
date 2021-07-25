import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import Feature from './Feature';
import { FeatureToggleProvider } from './FeatureToggleProvider';

const server = setupServer();

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

test('should show a loading component if specified', async () => {
  server.use(
    rest.get('http://some-mocked-unleash', (_, res, ctx) => {
      return res(
        ctx.json({
          version: 1,
          features: [
            {
              name: 'someFeature',
              enabled: true,
            },
          ],
        })
      );
    })
  );

  const { getByText, queryByText } = render(
    <FeatureToggleProvider
      url="http://some-mocked-unleash"
      loadingComponent={<span>Loading...</span>}
    >
      <Feature name="someFeature">You can see this</Feature>
    </FeatureToggleProvider>
  );

  expect(getByText('Loading...'));

  await waitForElementToBeRemoved(() => queryByText('Loading...'));
});

test('should show nothing if loading component is not specified', async () => {
  server.use(
    rest.get('http://some-mocked-unleash', (_, res, ctx) => {
      return res(
        ctx.json({
          version: 1,
          features: [
            {
              name: 'someFeature',
              enabled: true,
            },
          ],
        })
      );
    })
  );

  const { getByText, container } = render(
    <FeatureToggleProvider url="http://some-mocked-unleash">
      <Feature name="someFeature">You can see this</Feature>
    </FeatureToggleProvider>
  );

  expect(container.nodeType === null);

  await waitFor(() => getByText('You can see this'));
});

test('should show an error component if specified', async () => {
  server.use(
    rest.get('http://some-mocked-unleash', (_, res, ctx) => {
      return res(
        ctx.json({
          message: 'Internal server error',
        }),
        ctx.status(500)
      );
    })
  );

  const { getByText } = render(
    <FeatureToggleProvider
      url="http://some-mocked-unleash"
      errorComponent={<span>omg</span>}
    >
      <Feature name="someFeature">You can see this</Feature>
    </FeatureToggleProvider>
  );

  await waitFor(() => expect(getByText('omg')));
});

// Deliberately skip this test as it is not fully implemented yet
test.skip('should throw an error if no error component is specified', async () => {
  server.use(
    rest.get('http://some-mocked-unleash', (_, res, ctx) => {
      return res(
        ctx.json({
          message: 'Internal server error',
        }),
        ctx.status(500)
      );
    })
  );

  try {
    render(
      <FeatureToggleProvider
        url="http://some-mocked-unleash"
        loadingComponent={<span>Loading...</span>}
      >
        <Feature name="someFeature">You can see this</Feature>
      </FeatureToggleProvider>
    );
  } catch (e) {
    expect(e.message).toEqual(
      'Error fetching feature toggles from service, check network response'
    );
  }
});
