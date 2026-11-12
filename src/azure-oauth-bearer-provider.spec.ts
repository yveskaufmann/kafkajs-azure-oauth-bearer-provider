import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AzureOAuthBearerProvider } from './azure-oauth-bearer-provider';

// vi.mock is hoisted above all imports, so the mock fn it references must be hoisted too.
const { getTokenMock } = vi.hoisted(() => ({
  getTokenMock: vi.fn().mockResolvedValue({ token: 'dummy-token', expiresOnTimestamp: 1234567890 }),
}));
vi.mock('@azure/identity', () => ({
  // A class rather than vi.fn(() => ...): the provider instantiates it with `new`, which arrow-function mocks reject.
  DefaultAzureCredential: class {
    getToken = getTokenMock;
  },
}));

describe('AzureOAuthBearerProvider', () => {
  beforeEach(() => {
    process.env.EVENTHUB_NAMESPACE = '';
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('brokers', () => {
    it('should provide the list of brokers (read ns from options)', () => {
      const azureOAuthProvider = new AzureOAuthBearerProvider({ namespace: 'my-namespace' });
      expect(azureOAuthProvider.brokers).toEqual(['my-namespace.servicebus.windows.net:9093']);
    });

    it('should provide the list of brokers (read ns from env.EVENTHUB_NAMESPACE)', () => {
      vi.stubEnv('EVENTHUB_NAMESPACE', 'my-namespace');

      const azureOAuthProvider = new AzureOAuthBearerProvider();
      expect(azureOAuthProvider.brokers).toEqual(['my-namespace.servicebus.windows.net:9093']);
    });

    it('should throw an error if namespace is not provided', () => {
      expect(() => {
        const azureOAuthProvider = new AzureOAuthBearerProvider();
        azureOAuthProvider.brokers;
      }).toThrow(/AzureOAuthBearerProvider: namespace is required - .+/);
    });
  });

  describe('saslOptions', () => {
    it('should provide the SASL options to authenticate again eventhub', async () => {
      const azureOAuthProvider = new AzureOAuthBearerProvider({ namespace: 'my-namespace' });
      const spyGetBearerToken = vi.spyOn(azureOAuthProvider, 'getBearerToken').mockResolvedValue({ value: 'my-token' });

      const saslOptions = azureOAuthProvider.saslOptions;
      expect(saslOptions).toEqual({
        mechanism: 'oauthbearer',
        oauthBearerProvider: expect.any(Function),
      });

      const token = await saslOptions.oauthBearerProvider();
      expect(token).toEqual({ value: 'my-token' });

      expect(spyGetBearerToken).toHaveBeenCalled();
    });
  });

  describe('getBearerToken', () => {
    it('should request an OAuth bearer token from Azure by scoping the eventhub namesapce', async () => {
      const azureOAuthProvider = new AzureOAuthBearerProvider({
        namespace: 'my-namespace',
      });

      const token = await azureOAuthProvider.getBearerToken();
      expect(token).toEqual({ value: 'dummy-token' });

      expect(getTokenMock).toHaveBeenCalledWith('https://my-namespace.servicebus.windows.net/.default');
    });

    it('should throw an error if the token request fails and no error handler was configured', async () => {
      const azureOAuthProvider = new AzureOAuthBearerProvider({
        namespace: 'my-namespace',
      });

      getTokenMock.mockRejectedValue(new Error('token-error'));

      await expect(azureOAuthProvider.getBearerToken()).rejects.toThrow('token-error');
    });

    it('should call the error handler if the token request fails', async () => {
      const errorHandler = vi.fn();
      const azureOAuthProvider = new AzureOAuthBearerProvider({
        namespace: 'my-namespace',
        errorHandler,
      });

      getTokenMock.mockRejectedValue(new Error('token-error'));

      await azureOAuthProvider.getBearerToken();
      expect(errorHandler).toHaveBeenCalledWith(new Error('token-error'));
    });
  });
});
