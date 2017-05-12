const aws = require('aws-sdk');
const config = require('../config');

const awsConfig = new aws.Config({
  accessKeyId: config.aws_key,
  secretAccessKey: config.aws_secret,
  region: 'ap-southeast-1'
})

aws.config = awsConfig

aws.config.setPromisesDependency(require('es6-promise'));

global.AWS = new aws.S3({params: {Bucket : config.aws_s3_bucket_name}});

