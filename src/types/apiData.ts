export interface APIData {
    version: string;
    status: 'current' | 'upcoming' | 'deprecated';
    releaseDate?: string;
    deprecationDate?: string;
    migrationDeadline?: string;
    breakingChanges?: string[];
  }
  