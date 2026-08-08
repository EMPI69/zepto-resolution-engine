from app.actions import ActionExecutor


executor = ActionExecutor()

order = {
    "order_id": "ORD-9915",
    "value_inr": 412.0,
    "delivery_status": "delivered"
}


actions = [
    "partial_refund",
    "full_refund",
    "redelivery",
    "coupon",
    "apology_no_action",
    "escalation"
]


# ----------------------------------------------
# Normal action tests
# ----------------------------------------------

for action in actions:

    result = executor.execute(
        action,
        "N-015",
        order
    )

    print("\n" + "=" * 60)
    print("ACTION:", action)
    print("STATUS:", result["status"])
    print("MESSAGE:", result["message"])
    print("REFUND:", result["refund_amount"])


# ----------------------------------------------
# Policy safety test
# ----------------------------------------------

print("\n" + "=" * 60)
print("POLICY SAFETY TEST")

cancelled_order = {
    "order_id": "ORD-CANCELLED",
    "value_inr": 500.0,
    "delivery_status": "cancelled"
}

result = executor.execute(
    "redelivery",
    "N-TEST",
    cancelled_order
)

print("ACTION:", result["action"])
print("STATUS:", result["status"])
print("MESSAGE:", result["message"])