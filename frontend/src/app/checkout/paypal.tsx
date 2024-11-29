import React, { useEffect } from "react";

const PayPalButton = () => {
  useEffect(() => {
    const container = document.getElementById("paypal-button-container");

    // Xóa nút cũ nếu có
    if (container) container.innerHTML = "";

    // Kiểm tra và render nút
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "0.01",
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert("Transaction completed by " + details.payer.name.given_name);
            });
          },
        })
        .render("#paypal-button-container");
    }
  }, []);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
