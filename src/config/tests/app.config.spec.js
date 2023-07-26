import { expect } from 'chai';
import config from '../app.config';

describe('config/app.config', () => {

  it('sets the host', () => {
    expect(config).to.haveOwnProperty('sdkBase');
  });
});