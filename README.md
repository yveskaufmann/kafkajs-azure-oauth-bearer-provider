# @yveskaufmann/kafkajs-azure-oauth-bearer-provider - OAuth2.0 authentication with Azure EventHub.

[![npm version](https://badge.fury.io/js/@yveskaufmann%2Fkafkajs-azure-oauth-bearer-provider.svg)](https://badge.fury.io/js/@yveskaufmann%2Fkafkajs-azure-oauth-bearer-provider)
[![Node.js CI](https://github.com/yveskaufmann/kafkajs-azure-oauth-bearer-provider/actions/workflows/ci.yml/badge.svg)](https://github.com/yveskaufmann/kafkajs-azure-oauth-bearer-provide/actions/workflows/ci.yml)

OAuth Bearer Provider for kafkajs clients, requests access token by leveraging [DefaultAzureCredentials](https://learn.microsoft.com/en-us/javascript/api/overview/azure/identity-readme?view=azure-node-latest#defaultazurecredential) to gain access to Azure Event Hub via kafkajs.  

## Installation

```sh
npm install @yveskaufmann/kafkajs-azure-oauth-bearer-provider
```

## Usage

Now use the provider to configure the kafkajs client for authenticate against Azure Event Hubs by using OAuth 2.0.
The provider will use the existing [DefaultAzureCredentials](https://learn.microsoft.com/en-us/javascript/api/overview/azure/identity-readme?view=azure-node-latest#defaultazurecredential).

```ts
const azureOAuthProvider = new AzureOAuthBearerProvider({
  namespace: '<event-hub-namespace>'
});
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: azureOAuthProvider.brokers,
  sasl: azureOAuthProvider.saslOptions,
  ssl: true,
});
```
## Usage with AKS and Managed Identities 

1. Create a service account and annotate it with `azure.workload.identity/client-id=<client-id>`
2. Reference the service account within your deployment
3. Label your deployment pod template with `azure.workload.identity/use=true` 

## API Reference

- [API Reference](#api-reference)
  - [Options](#options)
  - [AzureOAuthBearerProvider](#azureoauthbearerprovider)
  - [EnvironmentVariables](#environmentvariables)

### Options

```typescript
/**
 * Options for AzureOAuthBearerProvider
 */
export interface AzureOAuthBearerProviderOptions {
  /**
   * The namespace of the EventHub. This is optional, and it can be provided as the environment variable EVENTHUB_NAMESPACE.
   */
  namespace?: string;
}
```

### AzureOAuthBearerProvider

````typescript
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
  constructor(options?: AzureOAuthBearerProviderOptions);

  /**
   * Gets the list of brokers for the KafkaJS client.
   */
  public get brokers(): string[];

  /**
   * Gets the SASL options for the KafkaJS client.
   */
  public get saslOptions(): SASLMechanismOptions<'oauthbearer'>;

  /**
   * Requests an OAuth bearer token from Azure that can be used to authenticate with EventHub.
   *
   * @returns The OAuth bearer token.
   */
  public async getBearerToken(): Promise<OauthbearerProviderResponse>;
}
````

### EnvironmentVariables

| Variable           | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| EVENTHUB_NAMESPACE | Namespace of the eventhub instance to authenticate against |
