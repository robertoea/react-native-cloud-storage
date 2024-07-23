import { withEntitlementsPlist, withInfoPlist, withPlugins, type ConfigPlugin } from '@expo/config-plugins';
import type { RNCloudStorageConfigPluginOptions } from './types';

const withRNCloudStorageInfoPlist: ConfigPlugin<RNCloudStorageConfigPluginOptions> = (config, options) =>
  withInfoPlist(config, async (newConfig) => {
    if (!config.ios?.bundleIdentifier) {
      throw new Error('Missing iOS bundle identifier');
    }
    const infoPlist = newConfig.modResults;
    const cloudBundleIdentifier = options?.iCloudBundleIdentifier ?? `iCloud.${config.ios.bundleIdentifier}`;
    infoPlist.NSUbiquitousContainers = {
      [`${cloudBundleIdentifier}`]: {
        NSUbiquitousContainerIsDocumentScopePublic: true,
        NSUbiquitousContainerSupportedFolderLevels: 'Any',
        NSUbiquitousContainerName: config.slug,
      },
    };

    return newConfig;
  });

const withRNCloudStorageEntitlementsPlist: ConfigPlugin<RNCloudStorageConfigPluginOptions> = (config, options) =>
  withEntitlementsPlist(config, async (newConfig) => {
    if (!config.ios?.bundleIdentifier) {
      throw new Error('Missing iOS bundle identifier');
    }
    const cloudBundleIdentifier = options?.iCloudBundleIdentifier ?? `iCloud.${config.ios.bundleIdentifier}`;
    const ubiquityKvstoreIdentifierSuffix = options?.ubiquityKvstoreIdentifierSuffix ?? `${config.ios.bundleIdentifier}`;
    const entitlementsPlist = newConfig.modResults;
    entitlementsPlist['com.apple.developer.icloud-container-identifiers'] = [`${cloudBundleIdentifier}`];
    entitlementsPlist['com.apple.developer.icloud-services'] = ['CloudDocuments'];
    entitlementsPlist['com.apple.developer.icloud-container-environment'] =
      options?.iCloudContainerEnvironment ?? 'Production';
    entitlementsPlist['com.apple.developer.ubiquity-container-identifiers'] = [`${cloudBundleIdentifier}`];
    entitlementsPlist[
      'com.apple.developer.ubiquity-kvstore-identifier'
    ] = `$(TeamIdentifierPrefix)${ubiquityKvstoreIdentifierSuffix}`;

    return newConfig;
  });

const withRNCloudStorageIos: ConfigPlugin<RNCloudStorageConfigPluginOptions> = (config, options) =>
  withPlugins(config, [[withRNCloudStorageInfoPlist, options], [withRNCloudStorageEntitlementsPlist, options]]);

export default withRNCloudStorageIos;
