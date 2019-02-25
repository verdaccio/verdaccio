
import _ from 'lodash';
import path from 'path';
import {parseConfigFile} from '../../../../src/lib/utils';


export default (options, url = 'default.yaml') => {
  const locationFile = path.join(__dirname, `../config/yaml/${url}`);
  const config = parseConfigFile(locationFile);
  
  return _.assign({}, _.cloneDeep(config), options);
}
