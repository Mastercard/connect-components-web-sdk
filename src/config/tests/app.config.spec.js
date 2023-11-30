import { expect } from 'chai';
import { appConfig as config } from '../app.config';

describe('config/app.config', () => {

  it('sets the host', () => {
    expect(config).to.haveOwnProperty('sdkBase');
  });
});