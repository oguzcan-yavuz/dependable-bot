import { REQUEST } from '@nestjs/core';
import { Scope } from '@nestjs/common';
import { GithubAdapter } from './adapters/github.adapter';
import { GitlabAdapter } from './adapters/gitlab.adapter';
import { Request } from 'express';
import { RemoteProviderToAdapterMap, RemoteAdapter } from './remote.types';

const getRemoteAdapter = (
  remoteProvider: string | undefined,
): RemoteAdapter | undefined => {
  const remoteProviderToAdapterMap: RemoteProviderToAdapterMap = {
    github: new GithubAdapter(),
    gitlab: new GitlabAdapter(),
  };

  return remoteProviderToAdapterMap[remoteProvider];
};

export const remoteAdapterFactory = {
  provide: 'REMOTE_ADAPTER',
  scope: Scope.REQUEST,
  useFactory: (req: Request) => {
    const remoteProvider = req.get('Remote-Provider').toLowerCase();
    const adapter = getRemoteAdapter(remoteProvider) || new GithubAdapter();

    return adapter;
  },
  inject: [REQUEST],
};
