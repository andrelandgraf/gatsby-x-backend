// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const { ENV, ERROR_TYPES } = require('../enums');
const PurchaseModel = require('../models/purchase');
const ItemModel = require('../models/item');
const UserModel = require('../models/user');
const { sendSlack } = require('../actions');

// Find your stripe endpoint's secret in your Dashboard's webhook settings
const endpointSecret = ENV.STRIPE_WEBHOOK_SECRET;

const tag = 'controllers/purchase.js';

const checkout = async (req, res) => {
  console.tag(tag).info('checkout called');
  const { id } = req.params;
  const { user } = req.body.token;

  if (user.items.find(objId => objId.toString() === id)) {
    console
      .tag(tag)
      .error('user managed to checkout item which they already paid for');
    return res.status(400).json({
      error: 'BadRequest',
      message: 'item already added',
      type: ERROR_TYPES.badRequest,
    });
  }

  console.tag(tag).verbose(`retrieving item with id ${id}`);
  const item = await ItemModel.findById(id);
  if (!item) {
    console.tag(tag).error('user managed to checkout item that does not exist');
    return res.status(404).json({
      error: 'NotFound',
      message: 'item not found',
      type: ERROR_TYPES.ressourceNotFound,
    });
  }
  console.tag(tag).debug(`retrieved item with image link ${item.imageUrl}`);

  console.tag(tag).verbose('creating stripe session...');
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        name: item.title,
        description: item.description,
        images: [`${ENV.MEDIA_PATH}/${item.imageUrl}`],
        amount: item.price,
        currency: 'usd',
        quantity: 1,
      },
    ],
    success_url: `${ENV.GATSBYX_DOMAIN}/${item.link}#success`,
    cancel_url: `${ENV.GATSBYX_DOMAIN}/${item.link}`,
    customer_email: user.email,
  });

  console
    .tag(tag)
    .verbose('creating pruchasing object and saving it to the database');
  PurchaseModel.create({
    sessionId: session.id,
    user: user._id,
    item: item._id,
  });

  return res.status(200).json({ session });
};

const onPurchaseCompleted = async (request, response) => {
  console.tag(tag).info('onPurchaseCompleted called');
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.tag(tag).error(`webhook error: ${err.message}`);
    return response.status(400).send(`webhook error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Fulfill the purchase...
    const purchase = await PurchaseModel.findOneAndUpdate(
      { sessionId: session.id },
      { success: true }
    );
    if (!purchase) {
      console.tag(tag).error(`purchase with sessionId ${session.id} not found`);
      return response
        .status(200)
        .json({ received: true, message: 'purchase with sessionId not found' });
    }

    const { user: userId, item: itemId } = purchase;

    const user = await UserModel.findById(userId);
    if (!user) {
      console.tag(tag).error('no user found for this purchase');
      return response
        .status(200)
        .json({ received: true, message: 'no user found for this purchase' });
    }

    const item = await ItemModel.findById(itemId);
    if (!item) {
      console.tag(tag).error('no item found for this purchase');
      return response
        .status(200)
        .json({ received: true, message: 'no item found for this purchase' });
    }

    user.items.push(item);
    user.save();

    sendSlack(`Juhu, another user bought ${item.title}!`);
  }

  // Return a response to acknowledge receipt of the event to stripe
  return response.status(200).json({ received: true });
};

module.exports = {
  checkout,
  onPurchaseCompleted,
};
