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
    "view_in_window",
    "is_studio",
    "total_price"
  )
)

dataset$city <- as.factor(dataset$city)
dataset$is_studio <- as.factor(dataset$is_studio)

build_regression_plot <- function(df, x_col, y_col) {
  pdf(sprintf("out/plots/%s_%s_plot.pdf", x_col, y_col))

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

build_regression_plot(dataset, "floor", "total_price")