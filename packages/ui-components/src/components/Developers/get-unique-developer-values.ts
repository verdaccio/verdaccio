import type { Developer } from '../../types/packageMeta';

function getUniqueDeveloperValues(developers?: Developer[]): Developer[] {
  if (!developers) {
    return [];
  }
  // developers without email would all compare equal (undefined === undefined)
  // and collapse into the first one, so fall back to the name
  const identity = (developer: Developer) => developer.email ?? developer.name;
  return developers.reduce(
    (accumulator: Developer[], current: Developer) =>
      accumulator.some((developer) => identity(developer) === identity(current))
        ? accumulator
        : [...accumulator, current],
    []
  );
}

export default getUniqueDeveloperValues;
