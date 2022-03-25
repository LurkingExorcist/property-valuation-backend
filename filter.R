library("dplyr")
library("stringr")
library("plyr")
library("data.table")

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
north_east <- "NORTH_EAST"
south_east <- "SOUTH_EAST"
north_west <- "NORTH_WEST"
south_west <- "SOUTH_WEST"

street <- "STREET"
unknown <- "UNKNOWN"

dataset$view_in_window <- as.character(dataset$view_in_window)

replace_by_reg <- function(vector, reg, value) {
  return(if_else(
    str_detect(vector, regex(reg, ignore_case = TRUE)),
    value,
    vector
  ))
}

dataset$view_in_window_2 <- if_else(
  (str_detect(dataset$view_in_window_2, regex("запад", ignore_case = TRUE)) &
    str_detect(dataset$view_in_window_2, regex("север", ignore_case = TRUE))) |
    str_detect(dataset$view_in_window_2, regex("�����, �����", ignore_case = TRUE)) |
    str_detect(dataset$view_in_window_2, regex("�����/�����", ignore_case = TRUE)),
  north_west,
  dataset$view_in_window_2
)

dataset$view_in_window_2 <- if_else(
  (str_detect(dataset$view_in_window_2, regex("запад", ignore_case = TRUE)) &
    str_detect(dataset$view_in_window_2, regex("юг", ignore_case = TRUE))) |
    str_detect(dataset$view_in_window_2, regex("��, �����", ignore_case = TRUE)) |
    str_detect(dataset$view_in_window_2, regex("�� ��/�� �����", ignore_case = TRUE)),
  south_west,
  dataset$view_in_window_2
)

dataset$view_in_window_2 <- if_else(
  (str_detect(dataset$view_in_window_2, regex("восток", ignore_case = TRUE)) &
    str_detect(dataset$view_in_window_2, regex("север", ignore_case = TRUE))) |
    str_detect(dataset$view_in_window_2, regex("�� �����/�� ������", ignore_case = TRUE)) |
    str_detect(dataset$view_in_window_2, regex("�����/������", ignore_case = TRUE)),
  north_east,
  dataset$view_in_window_2
)

dataset$view_in_window_2 <- if_else(
  str_detect(dataset$view_in_window_2, regex("восток", ignore_case = TRUE)) &
    str_detect(dataset$view_in_window_2, regex("юг", ignore_case = TRUE)),
  south_east,
  dataset$view_in_window_2
)

dataset$view_in_window_2 <- if_else(
  str_detect(dataset$view_in_window_2, regex("(запад)|(�� �����/�� �����)", ignore_case = TRUE)),
  west,
  dataset$view_in_window_2
)

dataset$view_in_window_2 <- if_else(
  str_detect(dataset$view_in_window_2, regex("(восток)|(�� ������)|(�� ����/�� ������)", ignore_case = TRUE)),
  east,
  dataset$view_in_window_2
)

dataset$view_in_window_2 <- if_else(
  str_detect(dataset$view_in_window_2, regex("(юг)|(�� ����/�� ��)", ignore_case = TRUE)),
  south,
  dataset$view_in_window_2
)

dataset$view_in_window_2 <- if_else(
  str_detect(dataset$view_in_window_2, regex("север", ignore_case = TRUE)),
  north,
  dataset$view_in_window_2
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "аэропорт",
  airport
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "парковка",
  parking
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(аллея)|(парк)|(площадь)",
  garden
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(река)|(пруд)|(озеро)|(Волга)|(яхт-клуб)",
  water
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "лес",
  forest
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(сектор)|(коттеджи)|(������� ������)",
  cottages
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(поле)|(Пустое пространство)",
  field
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(сад)|(площадка)|(����, �����, �����. ��������)|(���.���)|(������� ��������)",
  playground
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(школ)|(����, �����)|(����, ����� ����, �����, �����. ��������)",
  school
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(стройка)|(�������, �����)|(�������)",
  building
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(тц)|(Баскет холл)|(Леруа Мерлен)|(������ ����)|(����� ������)",
  mall
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(дорога)|(шоссе)|(трасса)|(��������� �����, ������, �������� ������)|(��������� �����, ������, �������� ������/�������� ����)|(��. ��������/��������� �����, ������, �������� ������)|(�������������� �����, ����� ���,, ������)|(��������������� �����, ����� ���, �����, �������)",
  highway
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(двор)|(�� ���� � �� �����)|(�� ����)|(����, �������� ���)|(����, ����� ����)|(����, ����� ����, ��������)|(����, �����, �����. ��������, ��������)|(����, ��������)",
  yard
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(город)|(�����, �� �����������)",
  city
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "(дом)|(����� ���)|(����� ����)|(��������������� �����, ����� ���)|(�� �����������, ����� ����)|(�������� ���/��. ��������)",
  house
)

dataset$view_in_window_2 <- replace_by_reg(
  dataset$view_in_window_2,
  "ул",
  street
)


dataset$view_in_window_2 <- as.factor(dataset$view_in_window)

summary(dataset$view_in_window_2)

# filtered_df <- dataset[
#   ,
#   c(
#     "city",
#     "floor",
#     "total_area",
#     "living_area",
#     "kitchen_area",
#     "room_count",
#     "height",
#     "view_in_window",
#     "is_studio",
#     "total_price"
#   )
# ]

# filtered_df %>%
#   subset(
#     !(city == "NULL" | str_detect(city, "�")) &
#       total_area > 0 &
#       living_area > 0 &
#       kitchen_area > 0 &
#       room_count > 0 &
#       total_price > 1
#   ) %>%
#   write.csv("out/tables/filtered_apartments.csv")