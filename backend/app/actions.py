from datetime import datetime


class ActionExecutor:

    def execute(
        self,
        action,
        ticket_id,
        order
    ):

        order_id = order["order_id"]
        order_value = float(order["value_inr"])

        delivery_status = str(
            order["delivery_status"]
        ).lower()

        # Final safety check:
        # cancelled orders cannot trigger redelivery.
        if (
            action == "redelivery"
            and delivery_status == "cancelled"
        ):
            return {
                "action": action,
                "status": "BLOCKED",
                "ticket_id": ticket_id,
                "order_id": order_id,
                "refund_amount": None,
                "message": (
                    "Execution blocked: cancelled orders "
                    "cannot trigger redelivery."
                ),
                "timestamp": datetime.now().isoformat()
            }

        # ----------------------------------------------
        # Partial refund
        # ----------------------------------------------

        if action == "partial_refund":

            return {
                "action": action,
                "status": "SIMULATED",
                "ticket_id": ticket_id,
                "order_id": order_id,
                "refund_amount": None,
                "message": (
                    "Partial refund approved for simulation, "
                    "but refund amount requires human/configured input."
                ),
                "timestamp": datetime.now().isoformat()
            }

        # ----------------------------------------------
        # Full refund
        # ----------------------------------------------

        if action == "full_refund":

            refund_amount = order_value

            return {
                "action": action,
                "status": "SIMULATED",
                "ticket_id": ticket_id,
                "order_id": order_id,
                "refund_amount": refund_amount,
                "message": (
                    f"Simulated full refund of "
                    f"₹{refund_amount:.2f}."
                ),
                "timestamp": datetime.now().isoformat()
            }

        # ----------------------------------------------
        # Redelivery
        # ----------------------------------------------

        if action == "redelivery":

            return {
                "action": action,
                "status": "SIMULATED",
                "ticket_id": ticket_id,
                "order_id": order_id,
                "refund_amount": None,
                "message": (
                    "Simulated redelivery request created."
                ),
                "timestamp": datetime.now().isoformat()
            }

        # ----------------------------------------------
        # Coupon
        # ----------------------------------------------

        if action == "coupon":

            return {
                "action": action,
                "status": "SIMULATED",
                "ticket_id": ticket_id,
                "order_id": order_id,
                "refund_amount": None,
                "message": (
                    "Simulated compensation coupon created."
                ),
                "timestamp": datetime.now().isoformat()
            }

        # ----------------------------------------------
        # No-action apology
        # ----------------------------------------------

        if action == "apology_no_action":

            return {
                "action": action,
                "status": "SIMULATED",
                "ticket_id": ticket_id,
                "order_id": order_id,
                "refund_amount": None,
                "message": (
                    "Simulated apology response generated."
                ),
                "timestamp": datetime.now().isoformat()
            }

        # ----------------------------------------------
        # Escalation
        # ----------------------------------------------

        if action == "escalation":

            return {
                "action": action,
                "status": "SIMULATED",
                "ticket_id": ticket_id,
                "order_id": order_id,
                "refund_amount": None,
                "message": (
                    "Ticket escalated for human handling."
                ),
                "timestamp": datetime.now().isoformat()
            }

        # ----------------------------------------------
        # Unknown action
        # ----------------------------------------------

        return {
            "action": action,
            "status": "NOT_EXECUTED",
            "ticket_id": ticket_id,
            "order_id": order_id,
            "refund_amount": None,
            "message": "Unknown action.",
            "timestamp": datetime.now().isoformat()
        }