install.packages("renv")
renv::init()

dir.create("models", showWarnings = FALSE)
dir.create("datasets", showWarnings = FALSE)
dir.create("analytic/plots", showWarnings = FALSE)
dir.create("analytics/tables", showWarnings = FALSE)