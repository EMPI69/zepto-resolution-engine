from app.engine import ResolutionEngine


engine = ResolutionEngine()

ticket_id = "N-015"

ticket = engine.new_tickets[
    engine.new_tickets["ticket_id"] == ticket_id
].iloc[0]

print()
print("=" * 80)
print("N-015 DEEP INSPECTION")
print("=" * 80)

print(f"\nTicket ID   : {ticket_id}")
print(f"Description : {ticket['description']}")
print(f"Order ID    : {ticket['order_id']}")

order = engine.get_order_context(ticket_id)

print("\nORDER")
print("-" * 80)

for key, value in order.items():
    print(f"{key:<20}: {value}")

print("\nTOP 3 PRECEDENTS")
print("-" * 80)

top_three = engine.retrieve(
    ticket["description"],
    top_k=3
)

for p in top_three:
    print(
        f"{p['ticket_id']} | "
        f"{p['similarity']:.2%} | "
        f"{p['action']} | "
        f"CSAT={p['csat']} | "
        f"{p['description']}"
    )

print("\nFULL EVIDENCE")
print("-" * 80)

evidence = engine.retrieve_evidence(
    ticket["description"],
    min_similarity=0.75
)

for p in evidence:
    print(
        f"{p['ticket_id']} | "
        f"{p['similarity']:.2%} | "
        f"{p['action']} | "
        f"CSAT={p['csat']}"
    )