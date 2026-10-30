"""Enumerate every decision path and report how often each ending is reached.

Run from the project root: python docs/design/tools/ending_sim.py  (python3 on macOS/Linux)
Edit the rules in resolve_ending() and re-run whenever the story changes.
"""
from collections import Counter
from itertools import product

D1_SEAL = ["open", "sealed"]
D2_RAM = ["accept", "refuse", "blackmail"]
REVEAL = ["revealed", "hidden"]  # end of Act I: did you let the Delta know you're alive?
D3_KIT = ["truth", "lie"]
D4_CONFESSION = ["deliver_full", "altered", "burn", "sell_guild", "sell_lock", "rumour"]
D5_GATES = ["lock", "tide", "guild", "post"]
SKILL = [0, 1, 2]  # how well the player manages rumours (systemic play, not a story choice)
ROUTE_LIMIT = 3  # towns you can reach in the final race (D6); Ione's boat adds one


def credibility(d2, d4, skill):
    """Number of towns (of 5 still standing) that believe your final warning."""
    cred = 2 + skill
    cred += {"accept": -1, "refuse": 1, "blackmail": 0}[d2]
    cred += {"deliver_full": 1, "burn": -1, "sell_guild": -1, "sell_lock": -1}.get(d4, 0)
    return max(0, min(5, cred))


def resolve_ending(reveal, d4, d5, cred):
    if reveal == "hidden" and d4 == "rumour":
        return "Ghost"
    if cred < 1:
        return "Too Late"
    if d4 == "deliver_full" and d5 in ("tide", "post"):
        return "The Open River"
    # Breaking the dikes reshapes the Delta whatever happened to the confession.
    if d5 == "tide":
        return "Wildwater"
    # Once the full confession is public the Guild is disgraced and the Lockwardens fill the gap.
    if d5 == "lock" or d4 == "sell_lock" or (d5 == "guild" and d4 == "deliver_full"):
        return "The Iron Gate"
    if d5 == "guild" or d4 in ("burn", "sell_guild"):
        return "The Quiet Delta"
    return "Clean Hands"  # only post with an altered or rumour-only confession remains


def towns_saved(d1, cred):
    """D6 decides *which* towns hear you first; this is how many of them act on it."""
    reach = ROUTE_LIMIT + (1 if d1 == "sealed" else 0)  # kept the seal: Ione lends the Post's fastest boat
    return min(cred, reach)


def kit_variant(d3, d4):
    if d3 == "truth":
        return "Kit stays"
    return "Kit leaves" if d4 == "deliver_full" else "Kit never knows"


def main():
    endings, variants, saved, total = Counter(), Counter(), Counter(), 0
    for d1, d2, reveal, d3, d4, d5, skill in product(
        D1_SEAL, D2_RAM, REVEAL, D3_KIT, D4_CONFESSION, D5_GATES, SKILL
    ):
        if d2 == "blackmail" and d1 == "sealed":
            continue  # can't blackmail with a letter you haven't read
        cred = credibility(d2, d4, skill)
        ending = resolve_ending(reveal, d4, d5, cred)
        endings[ending] += 1
        variants[(ending, kit_variant(d3, d4))] += 1
        saved[towns_saved(d1, cred)] += 1
        total += 1

    print(f"{total} valid paths\n")
    for ending, n in endings.most_common():
        print(f"{ending:<16} {n:>5}  {n / total:6.1%}")
    print("\nKit variants:")
    for (ending, kit), n in sorted(variants.items()):
        print(f"  {ending:<16} {kit:<16} {n:>4}")
    print("\nTowns saved in the final race (epilogue, not ending):")
    for n_towns, n in sorted(saved.items()):
        print(f"  {n_towns} towns  {n:>5}  {n / total:6.1%}")


if __name__ == "__main__":
    main()
