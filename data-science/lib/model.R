library(tidyverse)
library(mgcv)
library(dplyr)
library(formattable)

dir.create("out/models", showWarnings = FALSE)
dir.create("out/tables", showWarnings = FALSE)

set.seed(500)

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

train_gam_model <- function(dataset) {
  model <- gam(
    total_price ~
      s(city, k = 33) +
      s(floor) +
      s(total_area) +
      s(living_area) +
      s(kitchen_area) +
      s(room_count, k = 6) +
      s(height) +
      is_studio +
      view_building +
      view_city +
      view_cottages +
      view_field +
      view_north +
      view_playground +
      view_school +
      view_street +
      view_water +
      view_west,
    data = dataset
  )

  print(summary(model))

  saveRDS(model, "out/models/gam_model.rds")

  return(model)
}

predict_model <- function(model, dataset) {
  predicted_data <- dataset %>%
    mutate(
      total_price_pred = predict(model, newdata = .),
      difference_val = abs(total_price - total_price_pred),
      difference_percent = (abs((total_price_pred / total_price) - 1)) * 100
    ) %>%
    mutate(
      total_price = accounting(total_price),
      total_price_pred = accounting(total_price_pred),
      difference_val = accounting(difference_val),
      difference_percent = percent(difference_percent)
    )

  return(predicted_data)
}

train_data %>%
  train_gam_model() %>%
  predict_model(test_data) %>%
  summary() %>%
  write.csv("./out/tables/predicted_prices_summary.csv")