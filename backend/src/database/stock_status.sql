USE fashion_ecommerce;

CREATE OR REPLACE VIEW variation_stock_view AS
SELECT
  pv.product_id,
  pv.serial_number,
  pv.size_id,
  pv.color_id,
  pv.stock_quantity,
  CASE
    WHEN pv.stock_quantity > 10 THEN 'In Stock'
    WHEN pv.stock_quantity > 0 THEN 'Low in Stock'
    ELSE 'Out of Stock'
  END AS stock_status
FROM product_variations pv;
