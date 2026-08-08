from app.engine import ResolutionEngine


engine = ResolutionEngine()


print()
print("=" * 120)
print("DECISION ENGINE — ALL TICKETS")
print("=" * 120)

print(
    f"{'Ticket':<8}"
    f"{'Retrieval':<12}"
    f"{'Top3':<10}"
    f"{'Stability':<12}"
    f"{'Suggested Action':<22}"
    f"{'Executed':<18}"
    f"{'Status':<12}"
    f"{'Decision':<16}"
    f"Reason"
)

print("-" * 120)


auto_count = 0
human_count = 0
policy_block_count = 0


for _, ticket in engine.new_tickets.iterrows():

    ticket_id = ticket["ticket_id"]

    result = engine.resolve_ticket(
        ticket_id
    )

    retrieval = result.get(
        "retrieval_confidence",
        0.0
    )

    top3 = result.get(
        "top3_agreement",
        0.0
    )

    stability = result.get(
        "resolution_confidence",
        0.0
    )

    suggested_action = result.get(
        "suggested_action"
    )

    executed_action = result.get(
        "executed_action"
    )

    order = result.get(
        "order"
    )

    status = (
        order["delivery_status"]
        if order
        else "unknown"
    )

    decision = result["decision"]

    if decision == "AUTO_RESOLVE":
        auto_count += 1
    else:
        human_count += 1

    if any(
        not check["passed"]
        for check in result["policy_checks"]
    ):
        policy_block_count += 1

    print(
        f"{ticket_id:<8}"
        f"{retrieval:<12.2%}"
        f"{top3:<10.0%}"
        f"{stability:<12.2%}"
        f"{str(suggested_action):<22}"
        f"{str(executed_action):<18}"
        f"{status:<12}"
        f"{decision:<16}"
        f"{result['reason']}"
    )


print()
print("=" * 120)
print("SUMMARY")
print("=" * 120)

print(f"Total tickets       : {len(engine.new_tickets)}")
print(f"Auto-resolve        : {auto_count}")
print(f"Human review        : {human_count}")
print(f"Policy blocks       : {policy_block_count}")

print(
    f"Automation rate     : "
    f"{auto_count / len(engine.new_tickets):.2%}"
)