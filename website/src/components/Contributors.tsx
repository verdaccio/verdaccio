import Layout from '@theme/Layout';
import React from 'react';

type ContributorsProps = {
  contributors: any;
};

const Contributors: React.FC<ContributorsProps> = ({ contributors }): React.ReactElement => (
  <Layout
    title="Contributors 2"
    description="Verdaccio Contributors, thanks to the community Verdaccio keeps running">
    <div>contributors: {JSON.stringify(contributors, null, 3)}</div>
  </Layout>
);

export default Contributors;
