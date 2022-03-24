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

filtered_dataset <- dataset[
  ,
  c(
    "city",
    "section",
    "floor",
    "total_area",
    "living_area",
    "hallway_area",
    "kitchen_area",
    "room_count",
    "height",
    "view_in_window",
    "is_studio",
    "parking",
    "angular",
    "over_the_corridor",
    "riser",
    "total_price"
  )
]

filtered_dataset <- subset(
  filtered_dataset,
  city != "NULL" &
  total_area > 0 &
  living_area > 0 &
  hallway_area > 0 &
  kitchen_area > 0 &
  room_count > 0 &
  total_price > 1
)

write.csv(filtered_dataset, "out/filtered_apartments.csv")