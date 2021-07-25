import React from 'react';

import { useFeatureToggles } from './FeatureToggleProvider';

interface Props {
  name: string;
}

const Feature: React.FC<Props> = ({ name, children }) => {
  const toggles = useFeatureToggles();
  const isEnabled = toggles?.some(
    (toggle) => toggle.name === name && toggle.enabled
  );

  if (!isEnabled) {
    return null;
  }

  return <>{children}</>;
};

export default Feature;
