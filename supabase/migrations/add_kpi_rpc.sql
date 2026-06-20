-- Create an RPC function to aggregate order KPIs (total revenue and count)
-- This avoids loading all orders into memory just to calculate totals.

CREATE OR REPLACE FUNCTION get_order_kpis(p_org_id UUID)
RETURNS JSON AS $$
DECLARE
  v_total_revenue BIGINT;
  v_total_orders INT;
BEGIN
  SELECT 
    COALESCE(SUM(total), 0),
    COUNT(id)
  INTO 
    v_total_revenue,
    v_total_orders
  FROM orders
  WHERE organization_id = p_org_id AND status != 'cancelled';

  RETURN json_build_object(
    'total_revenue', v_total_revenue,
    'total_orders', v_total_orders
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
