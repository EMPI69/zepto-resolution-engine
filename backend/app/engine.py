from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# --------------------------------------------------
# Project paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


# --------------------------------------------------
# Resolution Engine
# --------------------------------------------------

class ResolutionEngine:

    def __init__(self):

        # Load the three datasets
        self.resolved = pd.read_csv(
            DATA_DIR / "resolved_tickets.csv"
        )

        self.new_tickets = pd.read_csv(
            DATA_DIR / "new_tickets.csv"
        )

        self.orders = pd.read_csv(
            DATA_DIR / "orders_context.csv"
        )

        # Make sure ticket descriptions are usable
        self.resolved["description"] = (
            self.resolved["description"]
            .fillna("")
            .astype(str)
        )

        # Create the TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            sublinear_tf=True
        )

        # Convert all historical ticket descriptions
        # into TF-IDF vectors
        self.history_matrix = self.vectorizer.fit_transform(
            self.resolved["description"]
        )

    # --------------------------------------------------
    # Retrieve similar historical tickets
    # --------------------------------------------------

    def retrieve(self, description: str, top_k: int = 5):

        # Convert the new ticket into a TF-IDF vector
        query_vector = self.vectorizer.transform(
            [description]
        )

        # Compare the new ticket against all historical tickets
        similarities = cosine_similarity(
            query_vector,
            self.history_matrix
        )[0]

        # Deterministic ranking:
        # 1. Higher similarity first
        # 2. Ticket ID ascending for exact similarity ties
        top_indices = sorted(
            range(len(similarities)),
            key=lambda index: (
                -float(similarities[index]),
                str(self.resolved.iloc[index]["ticket_id"])
            )
        )[:top_k]

        results = []

        for index in top_indices:

            row = self.resolved.iloc[index]

            results.append({
                "ticket_id": row["ticket_id"],
                "description": row["description"],
                "category": row["category"],
                "action": row["resolution_action"],
                "resolution_note": row["resolution_note"],
                "csat": float(row["csat"]),
                "similarity": round(
                    float(similarities[index]),
                    4
                )
            })

        return results

        # --------------------------------------------------
    # Retrieve all sufficiently relevant evidence
    # --------------------------------------------------

    def retrieve_evidence(
        self,
        description: str,
        min_similarity: float = 0.75
    ):

        query_vector = self.vectorizer.transform(
            [description]
        )

        similarities = cosine_similarity(
            query_vector,
            self.history_matrix
        )[0]

        evidence = []

        for index, similarity in enumerate(similarities):

            similarity = float(similarity)

            if similarity >= min_similarity:

                row = self.resolved.iloc[index]

                evidence.append({
                    "ticket_id": row["ticket_id"],
                    "description": row["description"],
                    "category": row["category"],
                    "action": row["resolution_action"],
                    "resolution_note": row["resolution_note"],
                    "csat": float(row["csat"]),
                    "similarity": round(
                        similarity,
                        4
                    )
                })

        # Deterministic ranking:
        # 1. Higher similarity first
        # 2. Ticket ID ascending for exact similarity ties
        evidence.sort(
            key=lambda item: (
                -item["similarity"],
                item["ticket_id"]
            )
        )

        return evidence
    
    # --------------------------------------------------
    # Analyze historical resolution evidence
    # --------------------------------------------------

    def analyze_precedents(self, precedents):

        action_scores = {}

        for precedent in precedents:

            action = precedent["action"]
            similarity = precedent["similarity"]

            action_scores[action] = (
                action_scores.get(action, 0)
                + similarity
            )

        if not action_scores:

            return {
                "recommended_action": None,
                "action_distribution": {},
                "agreement": 0.0
            }

        total_score = sum(
            action_scores.values()
        )

        distribution = {
            action: round(
                score / total_score,
                4
            )
            for action, score in action_scores.items()
        }

        ranked_actions = sorted(
            distribution.items(),
            key=lambda item: item[1],
            reverse=True
        )

        recommended_action = ranked_actions[0][0]

        agreement = ranked_actions[0][1]

        return {
            "recommended_action": recommended_action,
            "action_distribution": distribution,
            "agreement": round(
                agreement,
                4
            )
        }# --------------------------------------------------
    # Get order context for a ticket
    # --------------------------------------------------

    def get_order_context(self, ticket_id):

        # Find the incoming ticket
        ticket_rows = self.new_tickets[
            self.new_tickets["ticket_id"] == ticket_id
        ]

        if ticket_rows.empty:
            return None

        ticket = ticket_rows.iloc[0]

        # Get the order ID linked to this ticket
        order_id = ticket["order_id"]

        # Find the corresponding order
        order_rows = self.orders[
            self.orders["order_id"] == order_id
        ]

        if order_rows.empty:
            return None

        order = order_rows.iloc[0]

        return {
            "order_id": order["order_id"],
            "items": int(order["items"]),
            "value_inr": float(order["value_inr"]),
            "delivery_time_min": float(
                order["delivery_time_min"]
            ),
            "delivery_status": order["delivery_status"]
        }
    # --------------------------------------------------
    # Validate proposed action against order policies
    # --------------------------------------------------

    def check_policies(
        self,
        action,
        order,
        refund_amount=None
    ):

        checks = []

        delivery_status = str(
            order["delivery_status"]
        ).lower()

        order_value = float(
            order["value_inr"]
        )

        # --------------------------------------------------
        # Rule 1:
        # Cancelled orders cannot trigger redelivery.
        # --------------------------------------------------

        if (
            action == "redelivery"
            and delivery_status == "cancelled"
        ):
            checks.append({
                "rule": "cancelled_order_redelivery",
                "passed": False,
                "reason": (
                    "Cancelled orders cannot trigger redelivery."
                )
            })
        else:
            checks.append({
                "rule": "cancelled_order_redelivery",
                "passed": True,
                "reason": (
                    "No cancelled-order redelivery conflict."
                )
            })

        # --------------------------------------------------
        # Rule 2:
        # Refund cannot exceed order value.
        # --------------------------------------------------

        if (
            action in ["partial_refund", "full_refund"]
            and refund_amount is not None
        ):

            if refund_amount < 0:
                checks.append({
                    "rule": "refund_amount_non_negative",
                    "passed": False,
                    "reason": (
                        "Refund amount cannot be negative."
                    )
                })

            elif refund_amount > order_value:
                checks.append({
                    "rule": "refund_not_above_order_value",
                    "passed": False,
                    "reason": (
                        f"Refund amount ₹{refund_amount:.2f} "
                        f"exceeds order value ₹{order_value:.2f}."
                    )
                })

            else:
                checks.append({
                    "rule": "refund_not_above_order_value",
                    "passed": True,
                    "reason": (
                        f"Refund amount ₹{refund_amount:.2f} "
                        f"is within order value ₹{order_value:.2f}."
                    )
                })

        return checks
        # --------------------------------------------------
    # Resolve a complete incoming ticket
    # --------------------------------------------------

    def resolve_ticket(self, ticket_id):

        # ----------------------------------------------
        # 1. Find the incoming ticket
        # ----------------------------------------------

        ticket_rows = self.new_tickets[
            self.new_tickets["ticket_id"] == ticket_id
        ]

        if ticket_rows.empty:
            return {
                "ticket_id": ticket_id,
                "decision": "ERROR",
                "reason": "Ticket not found."
            }

        ticket = ticket_rows.iloc[0]

        description = str(
            ticket["description"]
        )

        # ----------------------------------------------
        # 2. Retrieve historical precedents
        # ----------------------------------------------

        # Retrieve all sufficiently relevant evidence
        evidence = self.retrieve_evidence(
            description,
            min_similarity=0.75
        )

        # Retrieve the actual top 3 precedents for display
        precedents = self.retrieve(
            description,
            top_k=3
        )

        # ----------------------------------------------
        # 3. Analyze historical actions
        # ----------------------------------------------

        evidence_analysis = self.analyze_precedents(
            evidence
        )

        proposed_action = (
            evidence_analysis["recommended_action"]
        )

        agreement = (
            evidence_analysis["agreement"]
         )

        # ----------------------------------------------
        # 4. Get order context
        # ----------------------------------------------

        order = self.get_order_context(
            ticket_id
        )

        if order is None:

            return {
                "ticket_id": ticket_id,
                "decision": "HUMAN_REVIEW",
                "suggested_action": proposed_action,
                "executed_action": None,
                "retrieval_confidence": 0.0,
                "resolution_confidence": 0.0,
                "reason": "Order context could not be found.",
                "precedents": precedents,
                "policy_checks": []
            }

        # ----------------------------------------------
        # 5. Apply policy checks
        # ----------------------------------------------

        policy_checks = self.check_policies(
            proposed_action,
            order
        )

        policy_failed = any(
            not check["passed"]
            for check in policy_checks
        )

        suggested_action = proposed_action
        executed_action = None

        # ----------------------------------------------
        # 6. Calculate retrieval confidence
        # ----------------------------------------------

        if precedents:

            retrieval_confidence = (
                precedents[0]["similarity"]
            )

        else:

            retrieval_confidence = 0.0

        # ----------------------------------------------
        # 7. Initial resolution confidence
        # ----------------------------------------------

        resolution_confidence = agreement

        # ----------------------------------------------
        # Calculate top-3 agreement
        # ----------------------------------------------

        top3_agreement = 0.0
        if len(precedents) >= 3:
            top_actions = [
                precedent["action"]
                for precedent in precedents
            ]
            top_action = top_actions[0]

            top3_agreement = (
                top_actions.count(top_action)
                / len(top_actions)
            )

        # ----------------------------------------------
        # 8. Decision gates
        # ----------------------------------------------

        if retrieval_confidence < 0.75:

            decision = "HUMAN_REVIEW"
            executed_action = None

            reason = (
                "No sufficiently similar historical "
                "precedent was found."
            )

        elif policy_failed:

            decision = "HUMAN_REVIEW"
            executed_action = None

            reason = (
                "The suggested action violates "
                "an order safety policy."
            )

        elif agreement < 0.70:

            decision = "HUMAN_REVIEW"
            executed_action = None

            reason = (
                "The recommended action is not "
                "stable across the broader historical evidence."
            )

        else:

            decision = "AUTO_RESOLVE"
            executed_action = proposed_action

            reason = (
                "Strong historical evidence, "
                "stable precedent support, and "
                "all policy checks passed."
            )
        # ----------------------------------------------
        # 9. Return complete decision
        # ----------------------------------------------

        return {
            "ticket_id": ticket_id,
            "description": description,

            "decision": decision,

            "suggested_action": suggested_action,
            "executed_action": executed_action,

            "retrieval_confidence": round(
                retrieval_confidence,
                4
            ),

            "resolution_confidence": round(
                resolution_confidence,
                4
            ),

            "top3_agreement": round(
                top3_agreement,
                4
            ),

            "reason": reason,

            "precedents": precedents,

            "action_distribution": (
                evidence_analysis[
                    "action_distribution"
                ]
            ),

            "order": order,
            "policy_checks": policy_checks
        }