const octokat 	= require('octokat');
const config 	= require('../config');

global.githubApp = new octokat({token: config.githubApiKey}).repos(config.githubOrganization, config.githubRepoName)

// https://github.com/philschatz/octokat.js