import Translate, { translate } from '@docusaurus/Translate';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/styles';
import { Orama, ProvidedTypes, create, insertMultiple, search } from '@orama/orama';
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { FC } from 'react';

import AddonCard from './AddonCard';
import { Addon, Filters } from './types';

type Props = {
  addons: Addon[];
  filters: Filters;
};

const normalizeResults = (hits) => {
  return hits.reduce((acc, item) => {
    acc.push(item.document);
    return acc;
  }, []);
};

const filterByProperty = (addsOns: Addon[], filters: Filters) => {
  console.log('filters', filters);
  const filtered = addsOns.filter((item) => {
    console.log('item', item.name);

    return (
      (item.origin === 'core' && filters.core) ||
      (item.origin === 'community' && filters.community) ||
      (item.category === 'authentication' && filters.authentication) ||
      (item.category === 'filter' && filters.filter) ||
      (item.category === 'ui' && filters.ui) ||
      (item.category === 'middleware' && filters.middleware) ||
      (item.category === 'tool' && filters.tool) ||
      (item.category === 'storage' && filters.storage) ||
      (item.bundled && filters.bundled)
    );
  });
  return filtered;
};

const ToolList: FC<Props> = ({ addons = [], filters }): React.ReactElement => {
  const theme = useTheme();
  const [db, setDb] = useState<Orama<ProvidedTypes>>();
  const [filteredAddsOn, setFilteredAddsOn] = useState(addons);
  useEffect(() => {
    const createDb = async () => {
      const db = await create({
        schema: {
          name: 'string',
          url: 'string',
          category: 'string',
          bundled: 'boolean',
          origin: 'string',
          latest: 'string',
          downloads: 'number',
          description: 'string',
        },
      });
      console.log('===>', db);
      setDb(db);
      insertMultiple(db as Orama<ProvidedTypes>, addons);
    };

    createDb();
  }, []);

  useEffect(() => {
    const searchKeyword = async () => {
      let results: Addon[] = addons;
      if (filters.keyword !== '') {
        const dbResults = await search(db as Orama<ProvidedTypes>, {
          term: filters.keyword,
        });
        results = [...normalizeResults(dbResults.hits)];
      }
      // TODO: apply advanced filters later
      // setFilteredAddsOn(filterByProperty(results, filters));
      setFilteredAddsOn(results);
    };
    searchKeyword();
  }, [filters, addons]);

  return (
    <div>
      <Typography
        fontSize="lg"
        fontWeight="lg"
        sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}
      >
        <Translate>Total results:</Translate> {filteredAddsOn.length}
      </Typography>
      <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3, xl: 4 }}>
        {filteredAddsOn.map((item) => {
          return (
            <Grid xs={12} md={12} lg={6} xl={4} key={item.name}>
              <AddonCard {...item} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default ToolList;
