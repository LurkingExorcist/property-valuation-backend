import("stats")
import("modules")

train <- function(dataset, formula) {
  model <- lm(
    formula,
    data = dataset
  )

  return(model)
}