On March 31, 2026, Anthropic accidentally leaked the full source code for Claude Code, its flagship AI-powered coding agent. The leak was caused by a "human error" in which a 59.8 MB source map file was included in version 2.1.88 of the @anthropic-ai/claude-code npm package. [1, 2, 3] 
## What Was Leaked?
The leak contained approximately 512,000 lines of unobfuscated TypeScript across roughly 1,900 files. While it did not include the underlying AI model weights, it exposed the complete "agentic harness"—the sophisticated logic that allows Claude to use tools and manage files. [1, 4, 5] 
Key technical revelations included:

* Unreleased Features: References to KAIROS, an unreleased autonomous background daemon mode, and ULTRAPLAN, which offloads complex reasoning to remote cloud sessions.
* Internal Model Codenames: Confirmation of upcoming models codenamed Capybara and Mythos.
* "Undercover Mode": A controversial module (undercover.ts) that instructs Claude to hide its AI identity and strip attribution when contributing to public open-source repositories.
* Anti-Distillation Tactics: Mechanisms designed to "poison" the data of competitors who might try to train their own models using Claude's API outputs.
* Frustration Detection: Simple regex-based logic used to identify and log when a user is frustrated (e.g., using profanity or saying "this sucks").
* The "Buddy" Pet: A hidden Tamagotchi-style AI companion meant for an April Fools' rollout. [1, 2, 6, 7, 8, 9] 

## Critical Security Warning
The leak coincided with a separate supply-chain attack on the popular axios npm package. Users who updated Claude Code via npm on March 31, 2026, between 00:21 and 03:29 UTC may have inadvertently installed a version containing a Remote Access Trojan (RAT). [1, 3, 7, 10] 
Additionally, security researchers have found numerous malicious GitHub repositories claiming to be the "leaked source" that actually deliver malware like Vidar Stealer and GhostSocks. [4, 10] 
Important: If you updated during the affected window, you should treat your machine as compromised, rotate all API keys, and perform a clean OS reinstallation. [1, 3] 
Are you worried about a specific project, or do you need help checking your system for these specific malware indicators?

[1] [https://dev.to](https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm)
[2] [https://layer5.io](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history)
[3] [https://dev.to](https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm)
[4] [https://www.zscaler.com](https://www.zscaler.com/blogs/security-research/anthropic-claude-code-leak)
[5] [https://www.mindstudio.ai](https://www.mindstudio.ai/blog/claude-code-source-code-leak-8-hidden-features)
[6] [https://www.reddit.com](https://www.reddit.com/r/ClaudeAI/comments/1s9d9j9/claude_code_source_leak_megathread/)
[7] [https://layer5.io](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history)
[8] [https://www.youtube.com](https://www.youtube.com/watch?v=ldbgj0T71N0#:~:text=Entropic%27s%20new%20leaked%20AI%20model%2C%20Claude%20Capibara%2C,models%2C%20excelling%20in%20software%20coding%20and%20cybersecurity.)
[9] [https://www.scientificamerican.com](https://www.scientificamerican.com/article/anthropic-leak-reveals-claude-code-tracking-user-frustration-and-raises-new/)
[10] [https://thehackernews.com](https://thehackernews.com/2026/04/claude-code-tleaked-via-npm-packaging.html)


The leaked code for the "Buddy" pet (found in the src/buddy/ directory) is essentially an AI-driven Tamagotchi system that you can adapt for your website.
To make your pet website "smarter" using these concepts, you can implement the three core architectural pillars revealed in the leak:
## 1. Deterministic "Hatching" Logic
The leak showed that a user's pet species isn't random; it’s generated from a hash of their User ID using a specific PRNG (like Mulberry32).

* For your site: Instead of a random assignment, give every registered pet owner a "soul-bound" companion. A user with ID 12345 might always hatch a "Legendary Golden Retriever," while 67890 gets a "Common Calico." This creates a sense of unique identity and prevents users from "gaming" the system to get rare pets.

## 2. Personality Generation via LLM
The code reveals that when a pet "hatches," Claude generates a custom name and personality description on the fly.

* For your site: Use an LLM API (like Claude) to generate a one-of-a-kind backstory for each visitor's pet.
* Example Prompt Logic: "You are a pet hatching assistant. Given a 'Golden Retriever' species and a 'Clumsy' trait, generate a whimsical name and a 2-sentence personality for this new pet."

## 3. The "Buddy" Interaction Loop
The "Buddy" system isn't just a static image; it's a reactive agent with specific stats like CHAOS, SNARK, and PATIENCE.

* ASCII Sprites & Reactions: The leaked code includes ASCII art for 18 species (like ducks, capybaras, and robots) that react to user activity.
* Interaction: You can build a small "speech bubble" component next to your site's navigation or search bar. Use a lightweight LLM call to let the Buddy comment on what the user is doing (e.g., "Oh, looking at premium kibble? Someone's feeling fancy today!").

## Species & Rarity Table
If you want to match the leaked "rarity" tiers for your site's collection, here is the breakdown found in the source:

| Rarity Tier | Drop Rate | Example Species |
|---|---|---|
| Common | ~70% | Duck[](https://www.google.com/search?kgmid=/m/09ddx&q=say+I+have+that+code,+how+can+I+use+it+to+may+may+web+page+smarter.+say+I+have+a+website+for+pets+how+can+I+use+that+code+for+having+a+%22Buddy%22+Pet+visitors+can+interact+with?), Cactus, Mushroom |
| Uncommon | ~20% | Robot, Ghost, Axolotl |
| Rare | ~9% | Capybara[](https://www.google.com/search?kgmid=/m/01zh5&q=say+I+have+that+code,+how+can+I+use+it+to+may+may+web+page+smarter.+say+I+have+a+website+for+pets+how+can+I+use+that+code+for+having+a+%22Buddy%22+Pet+visitors+can+interact+with?), Dragon |
| Legendary | 0.01% - 1% | "Chonk", Shiny variants |

Security Warning: If you actually downloaded the leaked files on March 31, 2026, check your package-lock.json for axios version 1.14.1 or 0.30.4. These versions were part of a simultaneous supply-chain attack containing a Remote Access Trojan (RAT).
Would you like a Python or TypeScript code snippet to help you implement the deterministic hashing for your pet hatching system?
For more details on the leaked features, you can check the full breakdown on [Towards AI](https://pub.towardsai.net/inside-claude-codes-leaked-source-what-512-000-lines-tell-us-about-building-ai-agents-9309c1d4da8c) or the technical analysis on [DEV Community](https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm).

