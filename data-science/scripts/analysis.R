library("dplyr")
library("stringr")
library("corrplot")
library("broom")
library("xlsx")

dir.create("out/tables", showWarnings = FALSE)
dir.create("out/plots", showWarnings = FALSE)

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

sample_n(dataset, 80) %>% write.xlsx('out/tables/data_slice.xlsx')

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

write_correlation_test <- function(df, x_col, y_col) {
  cor.test(df[, x_col], df[, y_col]) %>%
    tidy() %>%
    write.csv(sprintf(
      "out/tables/correlation_%s_%s.csv",
      x_col,
      y_col
    ))
}

correlations <- function(df) {
  selected_dataset <- df[
    ,
    c(
      "total_price",
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
      "view_yard"
    )
  ]

  write_correlation_test(selected_dataset, "floor", "total_price")
  write_correlation_test(selected_dataset, "total_area", "total_price")
  write_correlation_test(selected_dataset, "living_area", "total_price")
  write_correlation_test(selected_dataset, "kitchen_area", "total_price")
  write_correlation_test(selected_dataset, "room_count", "total_price")
  write_correlation_test(selected_dataset, "height", "total_price")
  write_correlation_test(selected_dataset, "is_studio", "total_price")
  write_correlation_test(selected_dataset, "view_building", "total_price")
  write_correlation_test(selected_dataset, "view_city", "total_price")
  write_correlation_test(selected_dataset, "view_cottages", "total_price")
  write_correlation_test(selected_dataset, "view_field", "total_price")
  write_correlation_test(selected_dataset, "view_forest", "total_price")
  write_correlation_test(selected_dataset, "view_north", "total_price")
  write_correlation_test(selected_dataset, "view_parking", "total_price")
  write_correlation_test(selected_dataset, "view_playground", "total_price")
  write_correlation_test(selected_dataset, "view_school", "total_price")
  write_correlation_test(selected_dataset, "view_street", "total_price")
  write_correlation_test(selected_dataset, "view_water", "total_price")
  write_correlation_test(selected_dataset, "view_west", "total_price")
  write_correlation_test(selected_dataset, "view_yard", "total_price")

  pdf("out/plots/correlation.pdf")

  cor(selected_dataset) %>%
    corrplot(
      method = "color",
      addCoef.col = "black",
      number.cex = 0.5,
      number.font = 1
    )

  dev.off()
}

run_all_analysis <- function() {
  build_regression_plot(dataset, "floor", "total_price")
  build_regression_plot(dataset, "total_area", "total_price")
  build_regression_plot(dataset, "living_area", "total_price")
  build_regression_plot(dataset, "kitchen_area", "total_price")
  build_regression_plot(dataset, "room_count", "total_price")
  build_regression_plot(dataset, "height", "total_price")

  write_grouping_table(dataset, "city")
  write_grouping_table(dataset, "floor")
  write_grouping_table(dataset, "room_count")
  write_grouping_table(dataset, "height")
  write_grouping_table(dataset, "is_studio")
  write_grouping_table(dataset, "view_building")
  write_grouping_table(dataset, "view_city")
  write_grouping_table(dataset, "view_cottages")
  write_grouping_table(dataset, "view_field")
  write_grouping_table(dataset, "view_forest")
  write_grouping_table(dataset, "view_north")
  write_grouping_table(dataset, "view_parking")
  write_grouping_table(dataset, "view_playground")
  write_grouping_table(dataset, "view_school")
  write_grouping_table(dataset, "view_street")
  write_grouping_table(dataset, "view_water")
  write_grouping_table(dataset, "view_west")
  write_grouping_table(dataset, "view_yard")

  correlations(dataset)
}

run_all_analysis()