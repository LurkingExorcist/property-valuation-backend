library(RestRserve)
library("jsonlite")
library("modules")
library("broom")

gam_model <- modules::use("src/models/gam.R")
lm_model <- modules::use("src/models/lm.R")

predictor <- modules::use("src/lib/predictor.R")

config <- modules::use("src/constants/config.R")


get_model <- function(model_type) {
  return(switch(model_type,
    "gam" = gam_model,
    "lm" = lm_model
  ))
}

get_model_path <- function(model_name) {
  paste("trained_models/", model_name, ".rds", sep = "")
}

get_dataset_path <- function(dataset_name) {
  paste("datasets/", dataset_name, ".csv", sep = "")
}

app <- Application$new()

app$add_post(
  path = "/train",
  FUN = function(.req, .res) {
    tryCatch({
      apartments <- read.table(
        get_dataset_path(.req$body$datasetName),
        sep = ",",
        header = TRUE,
        col.names = config$COL_NAMES
      )

      apartments$city <- as.numeric((as.factor(apartments$city)))

      model <- get_model(.req$body$modelType)

      result <- model$train(
        apartments,
        as.formula(.req$body$formula)
      )

      saveRDS(
        result,
        get_model_path(.req$body$name)
      )

      summary_result <- summary(result)

      .res$set_content_type("application/json")
      .res$set_body(
        list(
          "summary" = glance(result),
          "output" = capture.output(summary_result, file = NULL)
        )
      )
    }, warning = function(warn) {
      print(warn)

      .res$set_status_code(400L)
      .res$set_content_type("application/json")
      .res$set_body(
        list(
          status = 400,
          message = warn$message
        )
      )
    }, error = function(err) {
      print(err)

      .res$set_status_code(400L)
      .res$set_content_type("application/json")
      .res$set_body(
        list(
          status = 400,
          message = err$message
        )
      )
    }, finally = {
    })
  }
)

app$add_post(
  path = "/predict",
  FUN = function(.req, .res) {
    tryCatch({
      apartments <- read.table(
        get_dataset_path(.req$body$datasetName),
        sep = ",",
        header = TRUE,
        col.names = config$COL_NAMES
      )

      apartments$city <- as.numeric((as.factor(apartments$city)))

      model <- readRDS(get_model_path(.req$body$name))

      predicted_result <- predictor$predict_price(
        model,
        apartments
      )

      .res$set_content_type("application/json")
      .res$set_body(
        predicted_result
      )
    }, error = function(err) {
      print(err)

      .res$set_status_code(400L)
      .res$set_content_type("application/json")
      .res$set_body(
        list(
          status = 400,
          message = err$message
        )
      )
    }, finally = {
    })
  }
)


backend <- BackendRserve$new()
backend$start(app, http_port = config$PORT)
