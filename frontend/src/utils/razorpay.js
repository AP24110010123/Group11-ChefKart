export const openRazorpay = ({ orderId, amount, keyId, name, description, onSuccess, onFailure }) => {
  const options = {
    key: keyId,
    amount,
    currency: 'INR',
    name: 'ChefKart',
    description,
    order_id: orderId,
    handler: (response) => onSuccess && onSuccess(response),
    prefill: {
      name: name || '',
    },
    theme: { color: '#e8521a' },
    modal: {
      ondismiss: () => onFailure && onFailure('Payment cancelled'),
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (resp) => onFailure && onFailure(resp.error.description));
  rzp.open();
};
