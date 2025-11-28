```ruby

# hardcoded_durations = {
#   "09:00:00" => 900,
#   "09:10:00" => 300,
# }

hardcoded_durations = {
  "08:50:00" => 598,
  "09:00:00" => 300,
}



def format_duration(total_seconds)
  seconds = total_seconds % 60
  minutes = (total_seconds / 60) % 60
  hours = total_seconds / (60 * 60)

  hours_description = hours > 0 ? "#{hours}h" : ""
  minutes_description = minutes > 0 ? "#{minutes}m" : ""
  seconds_description = "#{seconds}s"

  "#{hours_description}#{minutes_description}#{seconds_description}"
end


current_time = Time.new(2025, 11, 28, 7, 0, 0)

for i in 1..15 do

  current_time_label = current_time.strftime('%H:%M:%S')

#  duration_of_task = hardcoded_durations[current_time_label] || rand * 10 * 60
 duration_of_task = hardcoded_durations[current_time_label] || 150

  puts "#{format_duration(duration_of_task.round)} :foo#{i}, #{current_time_label}, #{duration_of_task.round}s"

  current_time += (10 * 60)
end

```
