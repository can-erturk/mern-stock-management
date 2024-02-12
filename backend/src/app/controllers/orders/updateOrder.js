import connectDB from '#config/mongodb/connectDB.js';
import Order from '#models/orderModel.js';
import solveToken from '#helpers/solveToken.js';
import checkOrderExist from './helpers/checkOrderExist.js';

export default async function updateOrder(req, res) {
  const { jwt, order_id, updated_order } = req.body;

  // Check if update_field and updated_value provided
  if (!updated_order) {
    return res.send({
      status: 400,
      message: 'Updated order data is required.',
    });
  }

  // Check if updated order is valid
  if (updated_order.id || updated_order.access) {
    return res.send({
      status: 400,
      message: 'ID cannot be updated!',
    });
  }

  // Solve jwt and get user id as access variable
  const { id: access } = await solveToken(jwt);

  try {
    await connectDB();

    // Check if order already exist
    const newTitle = updated_order?.title;
    const isOrderExist = await checkOrderExist(access, newTitle);

    if (newTitle && isOrderExist === true) {
      return res.send({
        status: 400,
        message: 'Order already exist.',
      });
    }

    // Create promises array
    const updatePromise = [];

    // Loop through updated_order object and update each field
    for (const [key, value] of Object.entries(updated_order)) {
      updatePromise.push(
        await Order.findOneAndUpdate(
          { access, 'orders.id': order_id },
          { $set: { [`orders.$.${key}`]: value } },
        ),
      );
    }

    // Run all update promises
    await Promise.all(updatePromise);

    return res.send({
      status: 200,
      message: 'Order updated successfully',
    });
  } catch (error) {
    res.send({
      status: 500,
      message: error.message,
    });
  }
}
