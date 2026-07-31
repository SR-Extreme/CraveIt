import { useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { joinOrderRoom, listenDeliveryOtp } from "../../services/socketService";

const DeliveryOtpNotifier = () => {
  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const joinActiveOrders = async () => {
      try {
        const response = await axios.post(`${url}/api/order/userorders`, {});

        if (cancelled || !response.data.success) return;

        (response.data.data || []).forEach((order) => {
          if (order.status !== "Delivered") {
            joinOrderRoom(order._id);
          }
        });
      } catch (error) {
        console.log("Could not join order rooms for OTP alerts:", error.message);
      }
    };

    joinActiveOrders();

    const unsubscribe = listenDeliveryOtp((payload) => {
      if (!payload?.deliveryOtp || !payload?.orderId) return;
      toast.info("A delivery OTP has been sent to your orders.");
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [token, url]);

  return null;
};

export default DeliveryOtpNotifier;
