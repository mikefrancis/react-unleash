import axios, { AxiosRequestConfig } from 'axios';
import React from 'react';

interface Feature {
  name: string;
  enabled: boolean;
}

interface FeatureToggleResponse {
  version: number;
  features: Feature[];
}

const FeatureToggleContext = React.createContext<Feature[] | undefined>(
  undefined
);

interface FeatureToggleProviderProps {
  url: string;
  fetchConfig?: AxiosRequestConfig;
  loadingComponent?: React.ReactElement;
  errorComponent?: React.ReactElement;
}

type NetworkStatus = 'IDLE' | 'FETCHING' | 'SUCCESS' | 'ERROR';

export const FeatureToggleProvider: React.FC<FeatureToggleProviderProps> = ({
  children,
  url,
  fetchConfig = {},
  loadingComponent,
  errorComponent,
}) => {
  const [networkStatus, setNetworkStatus] =
    React.useState<NetworkStatus>('IDLE');
  const [featureToggles, setFeatureToggles] = React.useState<
    Feature[] | undefined
  >(undefined);

  React.useEffect(() => {
    if (networkStatus !== 'IDLE') {
      return;
    }

    setNetworkStatus('FETCHING');

    axios
      .get<FeatureToggleResponse>(url, fetchConfig)
      .then((data) => {
        setFeatureToggles(data.data.features);
        setNetworkStatus('SUCCESS');
      })
      .catch(() => {
        setNetworkStatus('ERROR');
      });
  }, [url, fetchConfig]);

  if (networkStatus === 'IDLE' || networkStatus === 'FETCHING') {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return null;
  }

  if (networkStatus === 'ERROR') {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    throw new Error(
      'Error fetching feature toggles from service, check network response'
    );
  }

  return (
    <FeatureToggleContext.Provider value={featureToggles}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

export const useFeatureToggles = () => {
  const featureToggles = React.useContext(FeatureToggleContext);

  return featureToggles;
};
