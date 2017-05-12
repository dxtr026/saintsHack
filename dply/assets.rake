# require 'ostruct'
# require 'pathname'
# require 'yaml'

# namespace :assets do

#   assets_dir = "dist/"
#   sourcemaps_dir = "tmp/sourcemaps"

#   s3sync = lambda do |src, dest|
#     puts "syncing #{src} to s3://#{dest}"
#     command = "s3cmd sync #{src} s3://#{dest} --acl-public --no-check-md5"
#     ok = sh command
#     raise "error while syncing to s3" if not ok
#     puts "successfully synced assets to s3"
#   end

#   task :sync_to_s3 do
#     conf = YAML.load_file "config/application.yml" rescue {}
#     conf = OpenStruct.new(conf)

#     if not conf.sync_assets_to_s3
#       puts "s3 sync disabled"
#       next
#     end

#     bucket_name = conf.assets_bucket_name
#     if not bucket_name
#       puts "s3 bucket not specified"
#       next
#     end

#     src = "#{assets_dir}"
#     dest = "#{bucket_name}/mobile/"
#     s3sync.call src, dest
#   end

# end

