library("dplyr")
library("stringr")
library("plyr")
library("data.table")
library(hash)

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

views_in_window_conditions[[south]] <- function(detect) {
  detect("(юг)|(�� ����/�� ��)")
}

views_in_window_conditions[[east]] <- function(detect) {
  detect("(восток)|(�� ������)|(�� ����/�� ������)")
}

views_in_window_conditions[[west]] <- function(detect) {
  detect("(запад)|(�� �����/�� �����)")
}

views_in_window_conditions[[parking]] <- function(detect) {
  detect("парковка")
}

views_in_window_conditions[[mall]] <- function(detect) {
  detect("(тц)|(Баскет холл)|(Леруа Мерлен)|(������ ����)|(����� ������)")
}

views_in_window_conditions[[garden]] <- function(detect) {
  detect("(аллея)|(парк)|(площадь)")
}

views_in_window_conditions[[yard]] <- function(detect) {
  detect("(двор)|(�� ���� � �� �����)|(�� ����)|(����, �������� ���)|(����, ����� ����)|(����, ����� ����, ��������)|(����, �����, �����. ��������, ��������)|(����, ��������)")
}

views_in_window_conditions[[water]] <- function(detect) {
  detect("(река)|(пруд)|(озеро)|(Волга)|(яхт-клуб)")
}

views_in_window_conditions[[house]] <- function(detect) {
  detect("(дом)|(����� ���)|(����� ����)|(��������������� �����, ����� ���)|(�� �����������, ����� ����)|(�������� ���/��. ��������)")
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

views_in_window_conditions[[highway]] <- function(detect) {
  detect("(дорога)|(шоссе)|(трасса)|(��������� �����, ������, �������� ������)|(��������� �����, ������, �������� ������/�������� ����)|(��. ��������/��������� �����, ������, �������� ������)|(�������������� �����, ����� ���,, ������)|(��������������� �����, ����� ���, �����, �������)")
}

views_in_window_conditions[[building]] <- function(detect) {
  detect("(стройка)|(�������, �����)|(�������)")
}

views_in_window_conditions[[school]] <- function(detect) {
  detect("(школ)|(����, �����)|(����, ����� ����, �����, �����. ��������)")
}

views_in_window_conditions[[airport]] <- function(detect) {
  detect("аэропорт")
}

views_in_window_conditions[[street]] <- function(detect) {
  detect("ул")
}


filtered_df <-
  subset(
    dataset[
      ,
      c(
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
    ],
    !(city == "NULL" | str_detect(city, "�")) &
      total_area > 0 &
      living_area > 0 &
      kitchen_area > 0 &
      room_count > 0 &
      total_price > 1
  )

filtered_df$view_in_window <- as.character(filtered_df$view_in_window)

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

process_views_in_windows <- function(views) {
  view_in_window_types <-
    lapply(
      seq_len(nrow(filtered_df)),
      function(x) NA
    )

  for (view in views) {
    recognize <- view_type_recognizer(view)

    view_in_window_types <- mapply(
      function(types, raw_value) {
        resulted_type <- ifelse(recognize(raw_value), view, NA)

        if (is.na(types)) {
          return(resulted_type)
        } else {
          if (!is.na(resulted_type)) {
            return(paste(
              types,
              resulted_type,
              sep = "_"
            ))
          } else {
            return(types)
          }
        }
      },
      types = view_in_window_types,
      raw_value = filtered_df$view_in_window
    )

    print(summary(as.factor(view_in_window_types)))
  }

  return(view_in_window_types)
}

filtered_df$view_in_window_types <- as.factor(process_views_in_windows(
  keys(views_in_window_conditions)
))

typeof(filtered_df$view_in_window_types)
summary(filtered_df$view_in_window_types)

filtered_df %>%
  write.csv("out/tables/filtered_apartments.csv")