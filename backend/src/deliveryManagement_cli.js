const readline = require('readline');
const Deliveries = require('./models/deliveries');
const Order = require('./models/order');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (q) => new Promise((resolve) => rl.question(q, resolve));

const printDeliveries = (deliveries) => {
  if (deliveries.length === 0) {
    console.log("No deliveries found.");
    return;
  }

  console.log(`\nDelivery ID | Order ID | Status     | Tracking Number      | Delivery Address`);
  console.log(`----------------------------------------------------------------------------------------`);
  deliveries.forEach((delivery) => {
    console.log(
      `${delivery.delivery_id.toString().padEnd(11)} | ` +
      `${delivery.order_id.toString().padEnd(8)} | ` +
      `${delivery.delivery_status.padEnd(10)} | ` +
      `${(delivery.tracking_number || 'N/A').toString().padEnd(20)} | ` +
      `${delivery.delivery_address}`
    );
  });
};

const showMenu = async () => {
  console.log('\n--- Delivery Management CLI ---');
  console.log('1. See all deliveries');
  console.log('2. See pending deliveries');
  console.log('3. See shipped deliveries');
  console.log('4. See delivered deliveries');
  console.log('5. Update delivery status');
  console.log('6. Exit');
  const choice = await prompt('Choose an option: ');
  return choice.trim();
};

const listDeliveries = async (status = '') => {
  const deliveries = await Deliveries.getAll();
  let filtered = deliveries;

  if (status) {
    filtered = deliveries.filter(delivery => delivery.delivery_status === status.toLowerCase());
  }

  printDeliveries(filtered);
};

const updateDeliveryStatus = async () => {
  while (true) {
    const deliveries = await Deliveries.getAll();
    const pendingOrShipped = deliveries.filter(delivery =>
      delivery.delivery_status === 'pending' || delivery.delivery_status === 'shipped'
    );

    if (pendingOrShipped.length === 0) {
      console.log("No pending or shipped deliveries found.");
      return;
    }

    console.log("\n--- Pending/Shipped Deliveries ---");
    printDeliveries(pendingOrShipped);

    const deliveryId = await prompt('\nEnter delivery ID to update (or press Enter to return to main menu): ');
    if (!deliveryId) return;

    const selectedDelivery = pendingOrShipped.find(d => d.delivery_id == deliveryId);
    if (!selectedDelivery) {
      console.log('Invalid delivery ID.');
      continue;
    }

    let nextStatus = '';
    if (selectedDelivery.delivery_status === 'pending') {
      console.log('Delivery status will be updated as -> shipped');
      nextStatus = 'shipped';
    } else if (selectedDelivery.delivery_status === 'shipped') {
      console.log('Delivery status will be updated as -> delivered');
      nextStatus = 'delivered';
    } else {
      console.log('This delivery cannot be updated.');
      continue;
    }

    const action = await prompt('1. Approve\n2. Reject\nChoose an action: ');

    if (action === '1') {
      if (nextStatus === 'shipped') {
        const trackingNumber = `TRK${Date.now().toString().slice(-6)}`; // last 6 digits of timestamp
        await Deliveries.updateTrackingNumberAndStatus(deliveryId, trackingNumber, nextStatus);
        console.log(`Delivery status updated to 'shipped' with tracking number ${trackingNumber}.`);
      } else {
        await Deliveries.updateStatus(deliveryId, nextStatus);
        console.log(`Delivery status updated to '${nextStatus}'.`);
      }

      const newOrderStatus = (nextStatus === 'shipped') ? 'in-transit' : 'delivered';
      await Order.updateStatus(selectedDelivery.order_id, newOrderStatus);
      console.log(`Order status updated to '${newOrderStatus}'.`);

    } else if (action === '2') {
      console.log('Action rejected. Returning to delivery listings...');
      continue;
    } else {
      console.log('Invalid action. Returning to delivery listings...');
      continue;
    }
  }
};

const startCLI = async () => {
  while (true) {
    const choice = await showMenu();
    if (choice === '1') {
      await listDeliveries();
    } else if (choice === '2') {
      await listDeliveries('pending');
    } else if (choice === '3') {
      await listDeliveries('shipped');
    } else if (choice === '4') {
      await listDeliveries('delivered');
    } else if (choice === '5') {
      await updateDeliveryStatus();
    } else if (choice === '6') {
      console.log('Exiting...');
      rl.close();
      process.exit(0);
    } else {
      console.log('Invalid choice. Please try again.');
    }
  }
};

startCLI();