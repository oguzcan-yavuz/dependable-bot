import { Injectable } from '@nestjs/common';
import {
  RemoteProvider,
  RemoteAdapter,
  RemoteProviderToAdapterMap,
} from './remote.types';
import { GithubAdapter } from './adapters/remote/github.adapter';
import { GitlabAdapter } from './adapters/remote/gitlab.adapter';

@Injectable()
export class RemoteAdapterFactory {
  getAdapter(remoteProvider: RemoteProvider): RemoteAdapter {
    const remoteProviderToAdapterMap: RemoteProviderToAdapterMap = {
      [RemoteProvider.Github]: new GithubAdapter(),
      [RemoteProvider.Gitlab]: new GitlabAdapter(),
    };
    const remoteAdapter = remoteProviderToAdapterMap[remoteProvider];

    return remoteAdapter;
  }
}
