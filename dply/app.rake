# namespace :app do

#   task :test do
#   end

#   task :build do
#     if not File.exists? "config/application.yml"
#       sh "curl -s http://config.internal.housing.com/mobile/config/application.yml > config/application.yml" do |ok, res|
#         cp "config/application.yml.sample", "config/application.yml" if not ok
#       end
#     end

#     sh "NODE_ENV=production ./build.sh"
#     sh "ruby script/assets/webp.rb"
#     rake "assets:sync_to_s3"

#     archive "mobile", gnu_tar: true do
#       add "dist"
#       add "server"
#       add "public"
#       add "manifest.json"
#       add "node_modules"
#       add "webpack-assets.json"
#       add "webpack-stats.json"
#       add "master-stats.json"
#       add "current-stats.json"
#       add_bundle
#     end
#   end

#   task "deploy:git" do
#     sh "NODE_ENV=production ./build.sh"
#     sh "sv rr"
#   end

#   task "deploy:archive" do
#     sh "sv rr"
#   end

#   task :reload do
#     sh "sv rr"
#   end

#   task :reopen_logs do
#     sh "sv rr"
#     sh "sv reopen_logs"
#   end

#   task :stop do
#     sh "sv stop"
#   end

# end
