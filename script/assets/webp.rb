# require 'fileutils'
# require 'digest'
# require 'benchmark'

# class Webp

#   attr_reader :webp_cache, :nowebp_cache, :img

#   def initialize(img, prefix: nil)
#     @img = img
#     @work_dir = "tmp/webp/work"
#     @cache_dir = "tmp/webp/cache"
#     @webp_cache = "#{@cache_dir}/#{md5}.webp"
#     @nowebp_cache = "#{@cache_dir}/#{md5}.nowebp"
#     @prefix = prefix
#     FileUtils.mkdir_p [@work_dir, @cache_dir]
#   end

#   def md5
#     @md5 ||= Digest::MD5.file(@img).hexdigest
#   end

#   def write
#     refresh_cache
#     if @nowebp
#       FileUtils.cp nowebp_cache, "#{img}.nowebp"
#     else
#       FileUtils.cp webp_cache, "#{img}.webp"
#     end
#   end

#   def print_message
#     webp = @nowebp ? "nowebp" : "webp"
#     printf "%-6s %7.2f kb  #{unprefixed_img}\n" % [webp, size_diff]
#   end

#   def size_diff
#     if @nowebp
#       diff = 0.0
#     else
#       diff = (File.stat(img).size - File.stat(webp_cache).size)/1024.0
#     end
#   end

#   private

#   def unprefixed_img
#     @unprefixed_img ||= (@prefix ? img.sub(/\A#{@prefix}/, "") : img)
#   end

#   def build_with_output
#     size = File.stat(img).size / 1024.0
#     printf "%-6s %7.2f kb  %-70s " % ["gen", size, unprefixed_img]
#     time = Benchmark.realtime { build_cache }
#     printf " (#{time.round(2)}s)\n"
#   end

#   def refresh_cache
#     if File.exists? nowebp_cache
#       FileUtils.touch nowebp_cache
#       @nowebp = true
#     elsif File.exists? webp_cache
#       FileUtils.touch webp_cache
#     else
#       build_with_output
#     end
#   end

#   def build_cache
#     webp_work = "#{@work_dir}/#{md5}.webp"
#     command = "cwebp -o \"#{webp_work}\" -mt -q 75 -alpha_q 100 -m 6 -af -quiet \"#{img}\""
#     ok = system command
#     raise "error generating webp" if not ok

#     if File.stat(img).size > File.stat(webp_work).size
#       FileUtils.mv webp_work, webp_cache
#     else
#       @nowebp = true
#       FileUtils.touch nowebp_cache
#     end
#   end

# end

# reduction = 0
# png_count = 0
# jpg_count = 0
# negative_cases = 0

# Dir["dist/images/**/*.png"].each do |img|
#   w = Webp.new(img, prefix: "dist/images/")
#   w.write
#   w.print_message
#   reduction += w.size_diff
#   png_count += 1
#   negative_cases += 1 if w.size_diff == 0
# end

# Dir["dist/images/**/*.jpg"].each do |img|
#   w = Webp.new(img, prefix: "dist/images/")
#   w.write
#   w.print_message
#   reduction += w.size_diff
#   jpg_count += 1
#   negative_cases += 1 if w.size_diff == 0
# end
# puts "="*40
# puts "#{png_count} pngs found"
# puts "#{jpg_count} jpgs found"
# puts "#{negative_cases} negative cases found"
# puts "size reduction: #{(reduction/1024.0).round(2)} mb"


