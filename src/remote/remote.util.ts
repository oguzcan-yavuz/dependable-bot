import { Dependency } from './remote.types';

export const mapToDependency = (map: Record<string, string>): Dependency[] => {
  return Object.entries(map).map(([packageName, version]) => ({
    name: packageName,
    version: version.replace(/[^\d\.]/g, ''),
  }));
};
