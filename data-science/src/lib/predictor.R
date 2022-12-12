import("dplyr")
import("stats")
import("modules")

options(warn = -1)

predict_price <- function(model, dataset) {
  predicted_data <- dataset %>%
    mutate(
      total_price_pred = predict(model, newdata = .),
      difference_val = abs(total_price - total_price_pred),
      difference_percent = (abs((total_price_pred / total_price) - 1))
    )

  return(predicted_data)
}
