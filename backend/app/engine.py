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

        # Find the indexes of the most similar tickets
        top_indices = similarities.argsort()[::-1][:top_k]

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
    # Analyze historical resolution evidence
    # --------------------------------------------------

    def analyze_precedents(self, precedents):

        action_scores = {}

        for precedent in precedents:

            action = precedent["action"]
            similarity = precedent["similarity"]

            # Give more weight to more similar cases
            action_scores[action] = (
                action_scores.get(action, 0)
                + similarity
            )

        # No evidence found
        if not action_scores:
            return {
                "recommended_action": None,
                "action_distribution": {},
                "agreement": 0.0
            }

        # Total similarity-weighted evidence
        total_score = sum(action_scores.values())

        # Convert scores into percentages
        distribution = {
            action: round(
                score / total_score,
                4
            )
            for action, score in action_scores.items()
        }

        # Sort actions from strongest to weakest
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
        }
    # --------------------------------------------------
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
            "items": order["items"],
            "value_inr": float(order["value_inr"]),
            "delivery_time_min": float(
                order["delivery_time_min"]
            ),
            "delivery_status": order["delivery_status"]
        }
    # --------------------------------------------------
    # Validate proposed action against order policies
    # --------------------------------------------------

    def check_policies(self, action, order):

        checks = []

        delivery_status = str(
            order["delivery_status"]
        ).lower()

        # Rule 1:
        # Cancelled orders cannot trigger redelivery.
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

        precedents = self.retrieve(
            description,
            top_k=5
        )

        # ----------------------------------------------
        # 3. Analyze historical actions
        # ----------------------------------------------

        evidence = self.analyze_precedents(
            precedents
        )

        proposed_action = (
            evidence["recommended_action"]
        )

        agreement = evidence["agreement"]

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
                "action": None,
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
        # 8. Make the decision
        # ----------------------------------------------

        if policy_failed:

            decision = "HUMAN_REVIEW"

            reason = (
                "The proposed action violates "
                "an order safety policy."
            )

            action = None

        elif agreement < 0.80:

            decision = "HUMAN_REVIEW"

            reason = (
                "Historical precedents do not "
                "provide strong enough agreement."
            )

            action = None

        else:

            decision = "AUTO_RESOLVE"

            reason = (
                "Historical precedents strongly "
                "support the proposed action and "
                "all policy checks passed."
            )

            action = proposed_action

        # ----------------------------------------------
        # 9. Return complete decision
        # ----------------------------------------------

        return {
            "ticket_id": ticket_id,
            "description": description,
            "decision": decision,
            "action": action,
            "retrieval_confidence": round(
                retrieval_confidence,
                4
            ),
            "resolution_confidence": round(
                resolution_confidence,
                4
            ),
            "reason": reason,
            "precedents": precedents,
            "action_distribution": (
                evidence["action_distribution"]
            ),
            "order": order,
            "policy_checks": policy_checks
        }