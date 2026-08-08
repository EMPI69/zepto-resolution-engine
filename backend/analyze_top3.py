from app.engine import ResolutionEngine


engine = ResolutionEngine()


print()
print("=" * 110)
print("TOP-3 PRECEDENT CALIBRATION")
print("=" * 110)

print(
    f"{'Ticket':<10}"
    f"{'Top 3 Actions':<45}"
    f"{'Top-3 Agreement':<18}"
    f"{'All Evidence':<35}"
)

print("-" * 110)


for _, ticket in engine.new_tickets.iterrows():

    ticket_id = ticket["ticket_id"]
    description = str(ticket["description"])

    # Get the top 3 historical precedents
    top_three = engine.retrieve(
        description,
        top_k=3
    )

    # Get all sufficiently relevant evidence
    all_evidence = engine.retrieve_evidence(
        description,
        min_similarity=0.75
    )

    # ----------------------------------------------
    # Top-3 action analysis
    # ----------------------------------------------

    top_actions = [
        item["action"]
        for item in top_three
    ]

    action_counts = {}

    for action in top_actions:
        action_counts[action] = (
            action_counts.get(action, 0) + 1
        )

    top3_best_count = max(
        action_counts.values()
    )

    top3_agreement = (
        top3_best_count / len(top_actions)
        if top_actions
        else 0
    )

    top3_text = ", ".join(
        top_actions
    )

    # ----------------------------------------------
    # Full evidence analysis
    # ----------------------------------------------

    full_analysis = engine.analyze_precedents(
        all_evidence
    )

    full_distribution = full_analysis[
        "action_distribution"
    ]

    full_text = ", ".join(
        f"{action}={percentage:.0%}"
        for action, percentage
        in full_distribution.items()
    )

    print(
        f"{ticket_id:<10}"
        f"{top3_text:<45}"
        f"{top3_agreement:<18.0%}"
        f"{full_text:<35}"
    )


print()
print("=" * 110)