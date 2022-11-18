import("dplyr")
import("stats")
import("modules")

predict_price <- function(model, dataset) {
  predicted_data <- dataset %>%
    mutate(
      total_price_pred = predict(model, newdata = .),
      difference_val = abs(total_price - total_price_pred),
      difference_percent = (abs((total_price_pred / total_price) - 1)) * 100
    )

  return(predicted_data)
}
