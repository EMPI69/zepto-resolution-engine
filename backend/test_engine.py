from app.engine import ResolutionEngine


engine = ResolutionEngine()


# --------------------------------------------------
# Test complete resolution pipeline
# --------------------------------------------------

ticket_id = "N-002"

result = engine.resolve_ticket(
    ticket_id
)


print()
print("=" * 70)
print("RESOLUTION ENGINE")
print("=" * 70)

print(
    f"\nTicket ID              : "
    f"{result['ticket_id']}"
)

print(
    f"Description            : "
    f"{result['description']}"
)

print(
    f"Decision               : "
    f"{result['decision']}"
)

print(
    f"Action                 : "
    f"{result['action']}"
)

print(
    f"Retrieval confidence   : "
    f"{result['retrieval_confidence']:.2%}"
)

print(
    f"Resolution confidence  : "
    f"{result['resolution_confidence']:.2%}"
)

print(
    f"Reason                 : "
    f"{result['reason']}"
)


print()
print("=" * 70)
print("ACTION DISTRIBUTION")
print("=" * 70)

for action, percentage in result[
    "action_distribution"
].items():

    print(
        f"{action:<20} "
        f"{percentage:.2%}"
    )


print()
print("=" * 70)
print("POLICY CHECKS")
print("=" * 70)

for check in result["policy_checks"]:

    status = (
        "PASS"
        if check["passed"]
        else "BLOCK"
    )

    print(
        f"[{status}] "
        f"{check['rule']}"
    )

    print(
        f"Reason: {check['reason']}"
    )


print()
print("=" * 70)
print("TOP PRECEDENTS")
print("=" * 70)

for precedent in result["precedents"]:

    print(
        f"{precedent['ticket_id']} | "
        f"{precedent['similarity']:.2%} | "
        f"{precedent['action']} | "
        f"{precedent['description']}"
    )