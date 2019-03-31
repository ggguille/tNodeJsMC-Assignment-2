/**
 * Create and export configuration variables
 */
'use strict';

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'tNodeJsMC#2',
    'stripe': {
        'key': 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
        'api_url': 'https://api.stripe.com/v1/'
    },
    'mailgun': {
        'key': '87f9b980e576e450ec0e6feaedcfe028-acb0b40c-91f94065',
        'domain': 'postmaster@sandbox5bd64c80e3e349af822ce6b075f862ae.mailgun.org',
        'api_url': 'https://api.mailgun.net/v3/'
    }
};

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'tNodeJsMC#2_production',
    'stripe': {
        'key': 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
        'api_url': 'https://api.stripe.com/v1/'
    },
    'mailgun': {
        'key': '87f9b980e576e450ec0e6feaedcfe028-acb0b40c-91f94065',
        'domain': 'postmaster@sandbox5bd64c80e3e349af822ce6b075f862ae.mailgun.org',
        'api_url': 'https://api.mailgun.net/v3/'
    }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = 
    typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to string
const environmentToExport = 
    typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;