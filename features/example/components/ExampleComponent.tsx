'use client';

import React from 'react';
import { useExampleQuery } from '../hooks/useExampleQuery';

export const ExampleComponent: React.FC = () => {
  const { data, isLoading, error } = useExampleQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div>
      <h2>Example Data</h2>
      {data?.data && (
        <ul>
          <li>ID: {data.data.id}</li>
          <li>Name: {data.data.name}</li>
        </ul>
      )}
    </div>
  );
};
