# react-unleash

🚧 WIP 🚧

## Installation

NPM:

```bash
npm install @mikefrancis/react-unleash
```

Yarn:

```bash
yarn add @mikefrancis/react-unleash
```

## Usage

Wrap your main application component in the `FeatureToggleProvider` component:

```jsx
import React from 'react';
import { FeatureToggleProvider } from '@mikefrancis/react-unleash';

const url = [
  'https://cors-anywhere.herokuapp.com',
  'https://app.unleash-hosted.com/demo/api/client/features',
].join('/');

const WrappedApp = () => {
  return (
    <FeatureToggleProvider url={url}>
      <App />
    </FeatureToggleProvider>
  );
};
```

Then anywhere inside `App` where you want to use feature toggles, you can either use the `Feature` component:

```jsx
import React from 'react';
import { Feature } from '@mikefrancis/react-unleash';

const App = () => {
  return (
    <Feature name="nameOfUnleashFeature">
      You can only see this if the feature is enabled
    </Feature>
  );
};
```

Or you can grab all the whole response and do what you like with it using the hook:

```jsx
import { useFeatureToggles } from '@mikefrancis/react-unleash';

const App = () => {
  const features = useFeatureToggles();

  return (
    <>
      <h1>
        There are {features.length > 10 ? 'more' : 'less'} than 10 features.
      </h1>
      <p>Thanks for coming to my TED talk.</p>
    </>
  );
};
```

## Props

| Key                | Type                                                                      | Required? | Default     | Description                                                                                  |
| ------------------ | ------------------------------------------------------------------------- | --------- | ----------- | -------------------------------------------------------------------------------------------- |
| `url`              | `string`                                                                  | Yes       | N/A         | The URL of the Unleash instance                                                              |
| `fetchConfig`      | [`RequestInit`](https://developer.mozilla.org/en-US/docs/Web/API/Request) | No        | `undefined` | Any other config to pass to fetch, such as custom headers etc.                               |
| `loadingComponent` | `JSX.Element`                                                             | No        | `null`      | A component to render while the toggles are being retrieved                                  |
| `errorComponent`   | `JSX.Element`                                                             | No        | `null`      | A component to render if the request fails. **If this is not set, an error will be thrown.** |
