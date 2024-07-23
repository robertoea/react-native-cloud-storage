export interface RNCloudStorageConfigPluginOptions {
  /**
   * The iCloud container environment to use. Defaults to 'Production'.
   */
  iCloudContainerEnvironment?: 'Production' | 'Development';
  iCloudBundleIdentifier?: string;
  ubiquityKvstoreIdentifierSuffix?: string;
}
