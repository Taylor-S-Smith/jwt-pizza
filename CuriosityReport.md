# Curiosity Report - Common Vulnerability Scoring System

I was intrigued by the CVSS. Before I started to do research, I generated the following questions. Below are my findings:

## What is CVSS?

CVSS is a standard way to compare the severity of vulnerabilities. It allows any vulnerability to be compared to any other one that is scored using this system.

## Who created it?

It was developed by the National Infrastructure Advisory Council while they were working an a research project [1]. I unfortunatley can't find details on the original research project that inspired it.

## Has it developed over time?

Yes! We are actually on version 4 of the system. When it initially released in 2005, it wasn't peer reviewed and a immediatly work began on a second version [1].

## How did it become the standard? Did it have to outcompete other standards?



## What are the shortcomings of the system, if any?

In general, the system is considered realiable and useful [2]. However, there are still several criticisms. Some criticise the limited input allowed when calculating a score. This sometimes results in scores that are much different then what those working it would put. For example, due to it's bias towards higher scores to any vulnerability concerning widley used network software, those working on the curl project have abondoned the system altogether in favor of their own internal scoring [4]. Some critisize the expertise of those assigning the scores. When a score isn't already given to a vulnerability, an Authorized Data Publisher will assign a score themselves. However, there is no garuntee that the ADP has expertise in the sofware they are rating, which has caused some vulnerabilities to have very incorrect severity scores [4]. Lastly, some critisize the complexity, which leads to misuse is the metrics [3].

## Sources:

1. https://en.wikipedia.org/wiki/Common_Vulnerability_Scoring_System
2. https://ieeexplore.ieee.org/document/7797152
3.https://www.softwaresecured.com/post/why-common-vulnerability-scoring-systems-suck#:~:text=As%20discussed%20earlier%20the%20major,static%20impact%20regardless%20of%20circumstance.
4. https://daniel.haxx.se/blog/2025/01/23/cvss-is-dead-to-us/
