import { DefaultAzureCredential } from '@azure/identity';
import { OauthbearerProviderResponse, SASLMechanismOptions } from 'kafkajs';

/**
 * Options for AzureOAuthBearerProvider
 */
export interface AzureOAuthBearerProviderOptions {
  /**
   * The namespace of the EventHub. This is optional, and it can be provided as the environment variable EVENTHUB_NAMESPACE.
   */
  namespace?: string;
}

/**
 * This class provides OAuth Bearer token for KafkaJS client to authenticate with Azure EventHubs.
 * It uses Azure Identity library to get the acess token, and it requires that the service account of
 * the deployment is bound to a managed identity with the necessary permissions to access the EventHub namespace.
 *
 * The class is designed to be used with KafkaJS client, and it provides the necessary configuration options.
 *
 * The namespace option is optional, and it can be provided as the environment variable EVENTHUB_NAMESPACE.
 *
 * Example usage:
 *
 * ```typescript
 *
 * const azureOAuthProvider = new AzureOAuthBearerProvider();
 * const kafka = new Kafka({
 *   clientId: 'my-app',
 *   brokers: azureOAuthProvider.brokers,
 *   sasl: azureOAuthProvider.saslOptions,
 *   ssl: true,
 * });
 * ```
 */
export class AzureOAuthBearerProvider {
  private credentials: DefaultAzureCredential;
  private options: AzureOAuthBearerProviderOptions;

  /**
   * Creates an instance of AzureOAuthBearerProvider.
   *
   * @param options - Options for AzureOAuthBearerProvider
   */
  constructor(options?: AzureOAuthBearerProviderOptions) {
    this.credentials = new DefaultAzureCredential();
    this.options = {
      namespace: process.env.EVENTHUB_NAMESPACE,
      ...options,
    };

    if (!this.options.namespace) {
      throw new Error(
        'AzureOAuthBearerProvider: namespace is required - provide it as an option or set the environment variable EVENTHUB_NAMESPACE.'
      );
    }
  }

  /**
   * Gets the list of brokers for the KafkaJS client.
   */
  public get brokers(): string[] {
    return [`${this.options.namespace}.servicebus.windows.net:9093`];
  }

  /**
   * Gets the SASL options for the KafkaJS client.
   */
  public get saslOptions(): SASLMechanismOptions<'oauthbearer'> {
    return {
      mechanism: 'oauthbearer',
      oauthBearerProvider: async () => this.getBearerToken(),
    };
  }

  /**
   * Requests an OAuth bearer token from Azure that can be used to authenticate with EventHub.
   *
   * @returns The OAuth bearer token.
   */
  public async getBearerToken(): Promise<OauthbearerProviderResponse> {
    const tokenEnvelope = await this.credentials.getToken(`https://${this.options.namespace}.servicebus.windows.net`);
    return {
      value: tokenEnvelope.token,
    };
  }
}
