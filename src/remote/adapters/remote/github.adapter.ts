import { RemoteAdapter } from '../../remote.types';
import { Octokit } from '@octokit/rest';
import { URL } from 'url';

const octokit = new Octokit({});

export class GithubAdapter implements RemoteAdapter {
  private getOwnerAndRepo(
    repositoryUrl: string,
  ): { owner: string; repo: string } {
    const url = new URL(repositoryUrl);
    const path = url.pathname;
    const [_, owner, repo] = path.split('/');

    return { owner, repo };
  }

  async getFileNames(repositoryUrl) {
    const { owner, repo } = this.getOwnerAndRepo(repositoryUrl);
    const {
      data: {
        commit: {
          tree: { sha },
        },
      },
    } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: 'master',
    });
    const {
      data: { tree },
    } = await octokit.git.getTree({ owner, repo, tree_sha: sha });
    const blobs = tree.filter(({ type }) => type === 'blob');
    const fileNames = blobs.map(({ path }) => path);

    return fileNames;
  }

  async getFileContents(repositoryUrl, fileName) {
    const { owner, repo } = this.getOwnerAndRepo(repositoryUrl);
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: fileName,
    });
    const content = Buffer.from(data.content, 'base64').toString();

    return content;
  }
}
