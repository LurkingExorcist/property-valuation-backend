ID = "id"
NUMBER = "number"
TYPE_OF_PLAN = "type_of_plan"
TYPE_OF_PLAN2 = "type_of_plan2"
TOTAL_AREA = "total_area"
LIVING_AREA = "living_area"
HALLWAY_AREA = "hallway_area"
KITCHEN_AREA = "kitchen_area"
VIEW_IN_WINDOW = "view_in_window"
SECTION = "section"
LINE = "line"
ENTRANCE = "entrance"
IS_STUDIO = "is_studio"
ROOM_COUNT = "room_count"
TOTAL_PRICE = "total_price"
FIRST_TOTAL_PRICE = "first_total_price"
PRICE_PER_SQUARE = "price_per_square"
FIRST_PRICE_PER_SQUARE = "first_price_per_square"
FLOOR = "floor"
DESCRIPTION = "description"
LINK_TYPE_OF_PLAN = "link_type_of_plan"
DATE_OF_SALE = "date_of_sale"
DATE_START_SALE = "date_start_sale"
TYPE = "type"
PARKING = "parking"
EXTERNAL_SYSTEM_ID = "external_system_id"
RECOMMENDATION_TOTAL_PRICE_ML = "recommendation_total_price_ml"
PRICE_CLASSIFICATION = "price_classification"
CITY = "city"
WARDROBE_TOTAL_AREA = "wardrobe_total_area"
STOCK = "stock"
HEIGHT = "height"
HOUSE_ID = "house_id"
ADDITIONAL_APARTMENT_STATUS_ID = "additional_apartment_status_id"
ANGULAR = "angular"
OVER_THE_CORRIDOR = "over_the_corridor"
RISER = "riser"
USER_ID = "user_id"

dataset = read.table(
  "data/apartments.csv",
  sep = ",",
  header = TRUE,
  col.names=c(
    ID,
    NUMBER,
    TYPE_OF_PLAN,
    TYPE_OF_PLAN2,
    TOTAL_AREA,
    LIVING_AREA,
    HALLWAY_AREA,
    KITCHEN_AREA,
    VIEW_IN_WINDOW,
    SECTION,
    LINE,
    ENTRANCE,
    IS_STUDIO,
    ROOM_COUNT,
    TOTAL_PRICE,
    FIRST_TOTAL_PRICE,
    PRICE_PER_SQUARE,
    FIRST_PRICE_PER_SQUARE,
    FLOOR,
    DESCRIPTION,
    LINK_TYPE_OF_PLAN,
    DATE_OF_SALE,
    DATE_START_SALE,
    TYPE,
    PARKING,
    EXTERNAL_SYSTEM_ID,
    RECOMMENDATION_TOTAL_PRICE_ML,
    PRICE_CLASSIFICATION,
    CITY,
    WARDROBE_TOTAL_AREA,
    STOCK,
    HEIGHT,
    HOUSE_ID,
    ADDITIONAL_APARTMENT_STATUS_ID,
    ANGULAR,
    OVER_THE_CORRIDOR,
    RISER,
    USER_ID
  )
)

filtered_dataset <- dataset[,
  c(
    CITY,
    SECTION,
    FLOOR,
    TOTAL_AREA,
    LIVING_AREA,
    HALLWAY_AREA,
    KITCHEN_AREA,
    ROOM_COUNT,
    HEIGHT,
    VIEW_IN_WINDOW,
    IS_STUDIO,
    PARKING,
    ANGULAR,
    OVER_THE_CORRIDOR,
    RISER,
    TOTAL_PRICE
  )
]

filtered_dataset <- subset(filtered_dataset, "total_area" > 0)

summary(filtered_dataset)