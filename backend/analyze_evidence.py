from app.engine import ResolutionEngine


engine = ResolutionEngine()


print()
print("=" * 100)
print("EVIDENCE CALIBRATION — ALL 30 TICKETS")
print("=" * 100)

print(
    f"{'Ticket':<10}"
    f"{'Max Sim':<12}"
    f"{'Evidence':<12}"
    f"{'Actions':<30}"
    f"{'Status'}"
)

print("-" * 100)


for _, ticket in engine.new_tickets.iterrows():

    ticket_id = ticket["ticket_id"]
    description = str(ticket["description"])

    # Get all historical cases above our provisional threshold
    evidence = engine.retrieve_evidence(
        description,
        min_similarity=0.75
    )

    # Find the strongest historical match
    top_match = engine.retrieve(
        description,
        top_k=1
    )

    max_similarity = (
        top_match[0]["similarity"]
        if top_match
        else 0.0
    )

    # Get distinct historical actions
    actions = sorted(
        set(
            item["action"]
            for item in evidence
        )
    )

    action_text = (
        ", ".join(actions)
        if actions
        else "NONE"
    )

    order = engine.get_order_context(
        ticket_id
    )

    status = (
        order["delivery_status"]
        if order
        else "unknown"
    )

    print(
        f"{ticket_id:<10}"
        f"{max_similarity:<12.2%}"
        f"{len(evidence):<12}"
        f"{action_text:<30}"
        f"{status}"
    )


print()
print("=" * 100)