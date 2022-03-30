library("dplyr")
library("stringr")

dataset <- read.table(
  "out/tables/filtered_apartments.csv",
  sep = ",",
  header = TRUE,
  col.names = c(
    "index",
    "city",
    "floor",
    "total_area",
    "living_area",
    "kitchen_area",
    "room_count",
    "height",
    "is_studio",
    "view_building",
    "view_city",
    "view_cottages",
    "view_field",
    "view_forest",
    "view_north",
    "view_parking",
    "view_playground",
    "view_school",
    "view_street",
    "view_water",
    "view_west",
    "view_yard",
    "total_price"
  )
)

dataset$city <- as.factor(dataset$city)

build_regression_plot <- function(df, x_col, y_col) {
  pdf(sprintf("out/plots/%s_%s_linreg.pdf", x_col, y_col))

  xy_df <- data.frame(x = df[, x_col], y = df[, y_col])
  xy_df <- xy_df[order(xy_df$x), ]

  xy_reg <- lm(formula = xy_df$y ~ xy_df$x)

  plot(xy_df, type = "p", pch = 18, col = "blue")
  abline(xy_reg, col = "red")

  dev.off()
}

write_grouping_table <- function(df, col_name) {
  df %>%
    group_by(df[, col_name]) %>%
    summarise(count = n()) %>%
    setNames(c(col_name, "count")) %>%
    write.csv(sprintf("out/tables/grouped_by_%s.csv", col_name))
}


# build_regression_plot(dataset, "floor", "total_price")
# build_regression_plot(dataset, "total_area", "total_price")
# build_regression_plot(dataset, "living_area", "total_price")
# build_regression_plot(dataset, "kitchen_area", "total_price")
# build_regression_plot(dataset, "room_count", "total_price")
# build_regression_plot(dataset, "height", "total_price")

# write_grouping_table(dataset, "city")
# write_grouping_table(dataset, "floor")
# write_grouping_table(dataset, "room_count")
# write_grouping_table(dataset, "height")
# write_grouping_table(dataset, "is_studio")
# write_grouping_table(dataset, "view_building")
# write_grouping_table(dataset, "view_city")
# write_grouping_table(dataset, "view_cottages")
# write_grouping_table(dataset, "view_field")
# write_grouping_table(dataset, "view_forest")
# write_grouping_table(dataset, "view_north")
# write_grouping_table(dataset, "view_parking")
# write_grouping_table(dataset, "view_playground")
# write_grouping_table(dataset, "view_school")
# write_grouping_table(dataset, "view_street")
# write_grouping_table(dataset, "view_water")
# write_grouping_table(dataset, "view_west")
# write_grouping_table(dataset, "view_yard")

selected_dataset <- dataset[
  ,
  c(
    "floor",
    "total_area",
    "living_area",
    "kitchen_area",
    "room_count",
    "height",
    "is_studio",
    "view_building",
    "view_city",
    "view_cottages",
    "view_field",
    "view_forest",
    "view_north",
    "view_parking",
    "view_playground",
    "view_school",
    "view_street",
    "view_water",
    "view_west",
    "view_yard",
    "total_price"
  )
]

# cor.test(selected_dataset$floor, selected_dataset$total_price)
# cor.test(selected_dataset$total_area, selected_dataset$total_price)
# cor.test(selected_dataset$living_area, selected_dataset$total_price)
# cor.test(selected_dataset$kitchen_area, selected_dataset$total_price)
# cor.test(selected_dataset$room_count, selected_dataset$total_price)
# cor.test(selected_dataset$height, selected_dataset$total_price)
# cor.test(selected_dataset$is_studio, selected_dataset$total_price)
# cor.test(selected_dataset$view_building, selected_dataset$total_price)
# cor.test(selected_dataset$view_city, selected_dataset$total_price)
# cor.test(selected_dataset$view_cottages, selected_dataset$total_price)
# cor.test(selected_dataset$view_field, selected_dataset$total_price)
# cor.test(selected_dataset$view_forest, selected_dataset$total_price)
# cor.test(selected_dataset$view_north, selected_dataset$total_price)
# cor.test(selected_dataset$view_parking, selected_dataset$total_price)
# cor.test(selected_dataset$view_playground, selected_dataset$total_price)
# cor.test(selected_dataset$view_school, selected_dataset$total_price)
# cor.test(selected_dataset$view_street, selected_dataset$total_price)
# cor.test(selected_dataset$view_water, selected_dataset$total_price)
# cor.test(selected_dataset$view_west, selected_dataset$total_price)
# cor.test(selected_dataset$view_yard, selected_dataset$total_price)

cor(selected_dataset) %>%
  round(3) %>%
  write.csv("out/tables/correlation.csv")