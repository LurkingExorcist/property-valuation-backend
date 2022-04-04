library(tidyverse)
library(caret)

theme_set(theme_classic())

apartments <- read.table(
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

apartments$city <- as.numeric((as.factor(apartments$city)))

train_len <- 0.8
test_len <- 1 - train_len

split_vec <- sample(
  c(
    rep(0, train_len * nrow(apartments)),
    rep(1, test_len * nrow(apartments))
  )
)

train_data <- apartments[split_vec == 0, ]
test_data <- apartments[split_vec == 1, ]

train_lm_model <- function(dataset) {
  model <- train(
    total_price ~
      poly(city, 20) +
      poly(floor, 8) +
      poly(total_area, 8) +
      poly(living_area, 8) +
      poly(kitchen_area, 8) +
      poly(room_count, 5) +
      poly(height, 8) +
      is_studio +
      view_building +
      view_city +
      view_cottages +
      view_field +
      view_forest +
      view_north +
      view_parking +
      view_playground +
      view_school +
      view_street +
      view_water +
      view_west +
      view_yard,
    data = dataset,
    method = "lm"
  )

  print(summary(model))

  saveRDS(model, "out/models/lm_model.rds")

  return(model)
}

plot_model <- function(model) {
  pdf("out/plots/predictions.pdf")

  area_price_df <- data.frame(x = test_data$total_area, y = test_data$total_price)
  predicted_price_df <- data.frame(x = test_data$total_area, y = predict(model, test_data))

  plot(area_price_df, type = "p", pch = 18, col = "blue")
  points(predicted_price_df, type = "p", pch = 18, col = "red")

  dev.off()
}

# summary(readRDS("out/models/lm_model.rds"))
model <- readRDS("out/models/lm_model.rds")
coef(model)