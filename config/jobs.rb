job "node-mobile" do
  command "node server/server/index.js"
  stdout_logfile "log/production.log"
  env %(NODE_ENV=production,NODE_PATH=#{Dir.pwd}/server,PORT="45%(process_num)02d" )
  startsecs 4
end
