import("mgcv")
import("modules")

train <- function(dataset, formula) {
  model <- gam(
    formula,
    data = dataset
  )

  return(model)
}
