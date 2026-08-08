# Zepto Resolution Engine

An evidence-based customer support resolution engine designed for automated ticket triage and safe resolution.

## Architecture

```text
New Ticket
    |
    v
Historical Ticket Retrieval
    |
    v
Similarity-Weighted Evidence
    |
    v
Action Recommendation
    |
    v
Policy Safety Checks
    |
    +--------------------+
    |                    |
    v                    v
AUTO_RESOLVE        HUMAN_REVIEW
    |
    v
Safe Action Executor
    |
    v
Simulated Execution