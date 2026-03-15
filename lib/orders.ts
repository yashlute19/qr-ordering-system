import { createClient } from "@/lib/supabase";

export async function createOrder(tableNumber: number, cart: any[], totalAmount: number) {
  const supabase = createClient();

  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      table_number: tableNumber,
      total_amount: totalAmount,
      status: 'queued',
      payment_status: 'paid' // Assuming payment is done for now
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order items
  const orderItems = cart.map(item => ({
    order_id: order.id,
    menu_item_id: item.id,
    quantity: item.quantity,
    price: item.price,
    notes: item.notes || null
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}
