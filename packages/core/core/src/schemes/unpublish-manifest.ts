import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv();

interface Manifest {
  name: string;
  versions: Record<string, unknown>;
  _rev: string;
  _id: string;
  time: {
    created: string;
    modified: string;
    [key: string]: string; // Allows pattern properties such as version numbers
  };
  readme: string;
  'dist-tags': {
    latest: string;
    [key: string]: unknown; // Allows additional properties
  };
}

// @ts-ignore
const schema: JSONSchemaType<Manifest> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    versions: { type: 'object', minProperties: 1 },
    _rev: { type: 'string' },
    _id: { type: 'string' },
    time: {
      type: 'object',
      properties: {
        created: { type: 'string' },
        modified: { type: 'string' },
      },
      patternProperties: {
        '^[0-9]+\\.[0-9]+\\.[0-9]+-\\d+$': { type: 'string' },
      },
      additionalProperties: true,
    },
    readme: { type: 'string' },
    'dist-tags': {
      type: 'object',
      properties: {
        latest: { type: 'string' },
      },
      required: ['latest'],
      additionalProperties: true,
    },
  },
  required: ['name', 'versions', 'dist-tags', '_rev', '_id', 'readme', 'time'],
  additionalProperties: true,
};

// validate is a type guard for MyData - type is inferred from schema type
const validate = ajv.compile(schema);

/**
 * Validate if a manifest has the correct structure when a new package
 * is being created. The properties name, versions and _attachments must contain 1 element.
 * @param data a manifest object
 * @returns boolean
 */
export function validateUnPublishSingleVersion(manifest: any) {
  if (!manifest) {
    return false;
  }
  return validate(manifest);
}
