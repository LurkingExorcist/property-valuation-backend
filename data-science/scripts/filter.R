library("dplyr")
library("stringr")
library("plyr")
library("hash")

dir.create("out/tables", showWarnings = FALSE)

dataset <- read.table(
  "data/apartments.csv",
  sep = ",",
  header = TRUE,
  col.names = c(
    "id",
    "number",
    "type_of_plan",
    "type_of_plan2",
    "total_area",
    "living_area",
    "hallway_area",
    "kitchen_area",
    "view_in_window",
    "section",
    "line",
    "entrance",
    "is_studio",
    "room_count",
    "total_price",
    "first_total_price",
    "price_per_square",
    "first_price_per_square",
    "floor",
    "description",
    "link_type_of_plan",
    "date_of_sale",
    "date_start_sale",
    "type",
    "parking",
    "external_system_id",
    "recommendation_total_price_ml",
    "price_classification",
    "city",
    "wardrobe_total_area",
    "stock",
    "height",
    "house_id",
    "additional_apartment_status_id",
    "angular",
    "over_the_corridor",
    "riser",
    "user_id"
  )
)

dataset$city <-
  mapvalues(
    dataset$city,
    c(
      "��� ���������", "������-���",
      "Екатеренбург", "Екатеринбург ", "������������", "������������ ",
      "Нижний Новогород",
      "Новосибирск "
    ),
    c(
      "ПГТ Медведево", "Йошкар-Ола",
      "Екатеринбург", "Екатеринбург", "Екатеринбург", "Екатеринбург",
      "Нижний Новгород",
      "Новосибирск"
    )
  )

parking <- "PARKING"
mall <- "MALL"
garden <- "GARDEN"
yard <- "YARD"
water <- "WATER"
house <- "HOUSE"
field <- "FIELD"
city <- "CITY"
forest <- "FOREST"
playground <- "PLAYGROUND"
cottages <- "COTTAGES"
highway <- "HIGHWAY"
building <- "BUILDING"
school <- "SCHOOL"
airport <- "AIRPORT"

north <- "NORTH"
south <- "SOUTH"
east <- "EAST"
west <- "WEST"

street <- "STREET"

views_in_window_conditions <- hash()

views_in_window_conditions[[north]] <- function(detect) {
  detect("север")
}

views_in_window_conditions[[west]] <- function(detect) {
  detect("(запад)|(�� �����/�� �����)")
}

views_in_window_conditions[[parking]] <- function(detect) {
  detect("парковка")
}

views_in_window_conditions[[yard]] <- function(detect) {
  detect("(двор)|(�� ���� � �� �����)|(�� ����)|(����, �������� ���)|(����, ����� ����)|(����, ����� ����, ��������)|(����, �����, �����. ��������, ��������)|(����, ��������)")
}

views_in_window_conditions[[water]] <- function(detect) {
  detect("(река)|(пруд)|(озеро)|(Волга)|(яхт-клуб)")
}

views_in_window_conditions[[field]] <- function(detect) {
  detect("(поле)|(Пустое пространство)")
}

views_in_window_conditions[[city]] <- function(detect) {
  detect("(город)|(�����, �� �����������)")
}

views_in_window_conditions[[forest]] <- function(detect) {
  detect("лес")
}

views_in_window_conditions[[playground]] <- function(detect) {
  detect("(сад)|(площадка)|(����, �����, �����. ��������)|(���.���)|(������� ��������)")
}

views_in_window_conditions[[cottages]] <- function(detect) {
  detect("(сектор)|(коттеджи)|(������� ������)")
}

views_in_window_conditions[[building]] <- function(detect) {
  detect("(стройка)|(�������, �����)|(�������)")
}

views_in_window_conditions[[school]] <- function(detect) {
  detect("(школ)|(����, �����)|(����, ����� ����, �����, �����. ��������)")
}

views_in_window_conditions[[street]] <- function(detect) {
  detect("ул")
}

filtered_df <-
  subset(
    dataset,
    !(city == "NULL" | str_detect(city, "�")) &
      total_area > 0 &
      living_area > 0 &
      kitchen_area > 0 &
      room_count > 0 &
      total_price > 1
  )

filtered_df$is_studio <- as.character(filtered_df$is_studio)
filtered_df$is_studio <- ifelse(filtered_df$is_studio == "True", 1, 0)
filtered_df$is_studio <- as.factor(filtered_df$is_studio)

views_in_window <- as.character(filtered_df$view_in_window)
total_price <- filtered_df$total_price

filtered_df <- filtered_df[
  ,
  c(
    "city",
    "floor",
    "total_area",
    "living_area",
    "kitchen_area",
    "room_count",
    "height",
    "is_studio"
  )
]

detector <- function(raw_value) {
  function(str) {
    return(str_detect(raw_value, regex(str, ignore_case = TRUE)))
  }
}

view_type_recognizer <- function(type) {
  function(raw_value) {
    detect <- detector(raw_value)
    views_in_window_conditions[[type]](detect)
  }
}

process_view_type <- function(view_type) {
  recognize <- view_type_recognizer(view_type)

  view_in_window_types <- sapply(
    views_in_window,
    function(raw_value) {
      return(ifelse(recognize(raw_value), 1, 0))
    }
  )

  return(view_in_window_types)
}

insert_columns_view_types <- function(view_types) {
  for (view_type in view_types) {
    col_view_type <- sprintf("view_%s", tolower(view_type))
    filtered_df[[col_view_type]] <- process_view_type(view_type)
  }

  return(filtered_df)
}

filtered_df <- insert_columns_view_types(keys(views_in_window_conditions))
filtered_df$total_price <- total_price

filtered_df %>%
  write.csv("out/tables/filtered_apartments.csv")