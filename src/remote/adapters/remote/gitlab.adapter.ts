import { RemoteAdapter } from '../../remote.types';

export class GitlabAdapter implements RemoteAdapter {
  getFileNames(repositoryUrl: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  getFileContents(repositoryUrl: string, fileName: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
