import Translate, { translate } from '@docusaurus/Translate';
import { useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import React, { ReactElement, useState } from 'react';
import { FC } from 'react';

import { Category, Filters, Origin } from './types';

type Props = {
  categories: Category[];
  origins: Origin[];
  onChange: (filters) => void;
};

const FilterControl: FC<Props> = ({ categories, origins, onChange }): ReactElement => {
  const theme = useTheme();
  const [filters, setFilters] = useState<Filters>({
    bundled: true,
    core: true,
    community: true,
    middleware: true,
    storage: true,
    tool: true,
    ui: true,
    authentication: true,
    filter: true,
    keyword: '',
  });

  const handleOnChange = (event) => {
    const { name } = event.target;
    let _filters = { ...filters };
    const validation = [...origins, ...categories, 'bundled', 'keyword'];
    if (!validation.includes(name)) {
      return;
    }
    if (name !== 'keyword') {
      _filters = { ..._filters, [name]: event.target.checked };
    } else {
      _filters = { ..._filters, keyword: event.target.value };
    }

    onChange(_filters);
    setFilters(_filters);
  };

  return (
    <Card sx={{ marginBottom: theme.spacing(2), padding: theme.spacing(2) }}>
      <Typography
        variant="h6"
        fontSize="lg"
        fontWeight="lg"
        sx={{ marginBottom: theme.spacing(1) }}
      >
        <Translate>Search Plugins / Tools</Translate>
      </Typography>
      <Alert severity="info" sx={{ marginBottom: theme.spacing(1) }}>
        <Translate>Items qualified as core are maintained actively by the verdaccio team</Translate>
      </Alert>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <TextField
            name="keyword"
            fullWidth
            value={filters.keyword}
            label={translate({ message: 'Filter' })}
            onChange={handleOnChange}
            size="small"
            variant="outlined"
          />
        </Grid>
        <Grid xs={12} sx={{ display: 'none' }}>
          <Typography fontSize="lg" fontWeight="lg">
            Origin
          </Typography>
          <FormGroup row>
            {Object.values(origins).map((name) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox
                    name={name}
                    onChange={handleOnChange}
                    checked={filters[name]}
                    size="small"
                  />
                }
                label={name}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid xs={12} sx={{ display: 'none' }}>
          <Typography fontSize="lg" fontWeight="lg">
            Categories
          </Typography>
          <FormGroup row>
            {Object.values(categories).map((name) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox
                    name={name}
                    onChange={handleOnChange}
                    checked={filters[name]}
                    size="small"
                  />
                }
                label={name}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid xs={12} sx={{ display: 'none' }}>
          <Typography fontSize="lg" fontWeight="lg">
            Options
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  name="bundled"
                  checked={filters.bundled}
                  size="small"
                  onChange={handleOnChange}
                />
              }
              label="Bundled"
            />
          </FormGroup>
        </Grid>
      </Grid>
    </Card>
  );
};

export default FilterControl;
