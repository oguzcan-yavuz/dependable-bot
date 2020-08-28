import { REQUEST } from '@nestjs/core';
import { Scope } from '@nestjs/common';
import { GithubAdapter } from './adapters/remote/github.adapter';
import { GitlabAdapter } from './adapters/remote/gitlab.adapter';
import { Request } from 'express';
import { RemoteProviderToAdapterMap, RemoteAdapter } from './remote.types';

const getRemoteAdapter = (
  remoteProvider: string | undefined,
): RemoteAdapter => {
  const remoteProviderToAdapterMap: RemoteProviderToAdapterMap = {
    github: new GithubAdapter(),
    gitlab: new GitlabAdapter(),
  };
  const lowerCaseRemoteProvider = remoteProvider
    ? remoteProvider.toLowerCase()
    : remoteProvider;
  const remoteAdapter = remoteProviderToAdapterMap[lowerCaseRemoteProvider];

  return remoteAdapter ? remoteAdapter : new GithubAdapter();
};

export const remoteAdapterFactory = {
  provide: 'REMOTE_ADAPTER',
  scope: Scope.REQUEST,
  useFactory: (req: Request) => {
    const remoteProvider = req.get('Remote-Provider');
    const remoteAdapter = getRemoteAdapter(remoteProvider);

    return remoteAdapter;
  },
  inject: [REQUEST],
};
