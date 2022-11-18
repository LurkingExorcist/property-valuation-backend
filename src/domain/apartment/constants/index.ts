export const DATASET_VIEW_COLUMNS = [
  'view_building',
  'view_city',
  'view_cottages',
  'view_field',
  'view_forest',
  'view_north',
  'view_parking',
  'view_playground',
  'view_school',
  'view_street',
  'view_water',
  'view_west',
  'view_yard',
] as const;

export const DATASET_TABLE_COLUMNS = [
  'index',
  'city',
  'floor',
  'total_area',
  'living_area',
  'kitchen_area',
  'room_count',
  'height',
  'is_studio',
  ...DATASET_VIEW_COLUMNS,
  'total_price',
] as const;
