import { Developer } from '../../../../../types/packageMeta';

function getUniqueDeveloperValues(developers?: Developer[]): Developer[] {
  if (!developers) {return [];}
  return developers.reduce(
    (accumulator: Developer[], current: Developer) =>
      accumulator.some(developer => developer.email === current.email) ? accumulator : [...accumulator, current],
    []
  );
}

export default getUniqueDeveloperValues;
